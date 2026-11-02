-- Additive only: no existing row is updated or deleted, and nothing is dropped.

-- When a verdict was cast. Existing rows stay NULL because that time was never recorded.
alter table public.user_label_interaction
	add column if not exists labeled_at timestamptz;

-- Speeds up the per-post lookups in get_next_unlabeled_post.
create index if not exists idx_uli_dataset_id
	on public.user_label_interaction using btree (dataset_id);

-- Validated separately so the check reads existing rows without changing them.
alter table public.user_label_interaction
	add constraint uli_label_valid check (label is null or label in ('TRUE', 'FALSE')) not valid;
alter table public.user_label_interaction
	validate constraint uli_label_valid;

-- Saves one verdict and returns the next post in a single call.
-- A retry of the same verdict succeeds, and a saved verdict is never overwritten.
create or replace function public.cast_verdict(uid uuid, post uuid, verdict text)
returns table (id uuid, content text, labeled_count bigint, remaining_count bigint)
language plpgsql
set search_path = public
as $$
declare
	saved text;
begin
	if verdict not in ('TRUE', 'FALSE') then
		raise exception 'invalid_verdict';
	end if;

	update public.user_label_interaction u
	set label = verdict, status = 'completed', labeled_at = now()
	where u.user_id = uid and u.dataset_id = post and u.status = 'started';

	if not found then
		select u.label into saved
		from public.user_label_interaction u
		where u.user_id = uid and u.dataset_id = post and u.status = 'completed';

		if saved is null then
			raise exception 'post_not_open';
		elsif saved <> verdict then
			raise exception 'already_decided';
		end if;
	end if;

	return query select * from public.get_next_unlabeled_post(uid);
end;
$$;

-- Only the server may call these. Browsers go through the app.
revoke all on function public.cast_verdict(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.cast_verdict(uuid, uuid, text) to service_role;
revoke all on function public.get_next_unlabeled_post(uuid) from public, anon, authenticated;
grant execute on function public.get_next_unlabeled_post(uuid) to service_role;

-- Row-level security already blocks these roles. This also removes TRUNCATE, which it does not cover.
revoke all on table public.dataset from anon, authenticated;
revoke all on table public.user_label_interaction from anon, authenticated;
