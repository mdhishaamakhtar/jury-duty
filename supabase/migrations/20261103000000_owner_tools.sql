-- Adds undo and the owner's results. Existing verdicts have no labeled_at, so undo can never reach them.

-- Owners are normal raters who can also see results. Add one with a single insert.
create table if not exists public.project_owners (
	user_id uuid primary key references auth.users (id) on delete cascade,
	created_at timestamptz not null default now()
);

alter table public.project_owners enable row level security;
revoke all on table public.project_owners from anon, authenticated;
grant select, insert, delete on table public.project_owners to service_role;

create or replace function public.is_project_owner(uid uuid)
returns boolean
language sql
security definer
set search_path = ''
as $$
	select exists (select 1 from public.project_owners where user_id = uid);
$$;

create or replace function public.undo_last_verdict(uid uuid)
returns table (id uuid, content text, labeled_count bigint, remaining_count bigint)
language plpgsql
set search_path = public
as $$
declare
	target uuid;
begin
	select u.id into target
	from public.user_label_interaction u
	where u.user_id = uid
		and u.status = 'completed'
		and u.labeled_at > now() - interval '10 minutes'
	order by u.labeled_at desc
	limit 1;

	if target is null then
		raise exception 'nothing_to_undo';
	end if;

	-- Releases the post the rater was just given. It holds no verdict.
	delete from public.user_label_interaction u
	where u.user_id = uid and u.status = 'started' and u.label is null;

	update public.user_label_interaction u
	set status = 'started', label = null, labeled_at = null
	where u.id = target;

	return query select * from public.get_next_unlabeled_post(uid);
end;
$$;

create or replace function public.project_totals()
returns table (posts bigint, labeled_posts bigint, verdicts bigint, true_verdicts bigint, raters bigint)
language sql
security definer
set search_path = ''
as $$
	select
		(select count(*) from public.dataset),
		(select count(distinct dataset_id) from public.user_label_interaction where status = 'completed'),
		(select count(*) from public.user_label_interaction where status = 'completed'),
		(select count(*) from public.user_label_interaction where status = 'completed' and label = 'TRUE'),
		(select count(distinct user_id) from public.user_label_interaction where status = 'completed');
$$;

create or replace function public.project_raters()
returns table (rater uuid, email text, verdicts bigint, true_verdicts bigint)
language sql
security definer
set search_path = ''
as $$
	select
		u.user_id,
		a.email::text,
		count(*),
		count(*) filter (where u.label = 'TRUE')
	from public.user_label_interaction u
	left join auth.users a on a.id = u.user_id
	where u.status = 'completed'
	group by u.user_id, a.email
	order by count(*) desc;
$$;

-- Every verdict on a post with two or more verdicts, which is all agreement can be measured on.
create or replace function public.project_overlap()
returns table (post uuid, rater uuid, label text)
language sql
security definer
set search_path = ''
as $$
	select u.dataset_id, u.user_id, u.label
	from public.user_label_interaction u
	where u.status = 'completed'
		and u.dataset_id in (
			select dataset_id
			from public.user_label_interaction
			where status = 'completed'
			group by dataset_id
			having count(*) >= 2
		)
	order by u.dataset_id, u.user_id;
$$;

create or replace function public.project_disagreements(max_rows integer)
returns table (post uuid, content text, true_votes bigint, false_votes bigint)
language sql
security definer
set search_path = ''
as $$
	select
		d.id,
		d.content,
		count(*) filter (where u.label = 'TRUE'),
		count(*) filter (where u.label = 'FALSE')
	from public.user_label_interaction u
	join public.dataset d on d.id = u.dataset_id
	where u.status = 'completed'
	group by d.id, d.content
	having count(distinct u.label) > 1
	order by d.id
	limit max_rows;
$$;

create or replace function public.project_export(after_id uuid, max_rows integer)
returns table (id uuid, post uuid, content text, rater uuid, label text, labeled_at timestamptz)
language sql
security definer
set search_path = ''
as $$
	select u.id, u.dataset_id, d.content, u.user_id, u.label, u.labeled_at
	from public.user_label_interaction u
	join public.dataset d on d.id = u.dataset_id
	where u.status = 'completed'
		and (after_id is null or u.id > after_id)
	order by u.id
	limit max_rows;
$$;

revoke all on function public.undo_last_verdict(uuid) from public, anon, authenticated;
revoke all on function public.is_project_owner(uuid) from public, anon, authenticated;
revoke all on function public.project_totals() from public, anon, authenticated;
revoke all on function public.project_raters() from public, anon, authenticated;
revoke all on function public.project_overlap() from public, anon, authenticated;
revoke all on function public.project_disagreements(integer) from public, anon, authenticated;
revoke all on function public.project_export(uuid, integer) from public, anon, authenticated;

grant execute on function public.undo_last_verdict(uuid) to service_role;
grant execute on function public.is_project_owner(uuid) to service_role;
grant execute on function public.project_totals() to service_role;
grant execute on function public.project_raters() to service_role;
grant execute on function public.project_overlap() to service_role;
grant execute on function public.project_disagreements(integer) to service_role;
grant execute on function public.project_export(uuid, integer) to service_role;
