-- Base tables and post assignment. A new deployment starts here.

create table if not exists public.dataset (
	id uuid primary key default gen_random_uuid(),
	content text,
	label text
);

create table if not exists public.user_label_interaction (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references auth.users (id) on update cascade on delete cascade,
	dataset_id uuid references public.dataset (id) on update cascade on delete cascade,
	label text,
	status character varying(20) default 'completed'
);

create unique index if not exists ux_uli_user_dataset
	on public.user_label_interaction using btree (user_id, dataset_id);

create unique index if not exists ux_uli_one_active_start_per_user
	on public.user_label_interaction using btree (user_id)
	where status = 'started';

alter table public.dataset enable row level security;
alter table public.user_label_interaction enable row level security;

-- New Supabase projects don't grant table access automatically. Only the server reads these.
grant select, insert, update, delete on table public.dataset to service_role;
grant select, insert, update, delete on table public.user_label_interaction to service_role;

create or replace function public.get_next_unlabeled_post(uid uuid)
returns table (id uuid, content text, labeled_count bigint, remaining_count bigint)
language sql
as $$
with current_started as (
	-- A rater keeps the post they already have open.
	select uli.dataset_id
	from user_label_interaction uli
	where uli.user_id = uid and uli.status = 'started'
	order by uli.dataset_id
	limit 1
),
ranked as (
	select
		d.id,
		case
			when count(*) filter (where uli.status is not null) = 0 then 1
			when count(*) filter (where uli.status = 'completed') = 1
				and count(*) filter (where uli.status = 'started') = 0 then 2
			when count(*) filter (where uli.status = 'completed') >= 2
				and count(*) filter (where uli.status = 'started') = 0 then 3
			else 4
		end as priority
	from dataset d
	left join user_label_interaction uli on uli.dataset_id = d.id
	where not exists (
		select 1
		from user_label_interaction uli2
		where uli2.dataset_id = d.id and uli2.user_id = uid and uli2.status = 'completed'
	)
	group by d.id
),
picked as (
	select r.id
	from ranked r
	join dataset d on d.id = r.id
	where not exists (select 1 from current_started)
	order by r.priority, r.id
	for update of d skip locked
	limit 1
),
upsert as (
	insert into user_label_interaction (user_id, dataset_id, status)
	select uid, p.id, 'started'
	from picked p
	on conflict (user_id, dataset_id) do update set status = excluded.status
	returning dataset_id
),
chosen as (
	select dataset_id as id from current_started
	union all
	select dataset_id as id from upsert
	limit 1
),
user_stats as (
	select
		count(*) filter (where uli.status = 'completed') as labeled_count,
		(select count(*) from dataset) - count(*) filter (where uli.status = 'completed') as remaining_count
	from user_label_interaction uli
	where uli.user_id = uid
)
select
	c.id,
	(select d2.content from dataset d2 where d2.id = c.id) as content,
	us.labeled_count,
	us.remaining_count
from chosen c
cross join user_stats us;
$$;
