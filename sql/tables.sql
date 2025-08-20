create table public.user_label_interaction (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  dataset_id uuid null,
  label text null,
  status character varying(20) null default 'completed'::character varying,
  constraint user_label_interaction_pkey primary key (id),
  constraint user_label_interaction_dataset_id_fkey foreign KEY (dataset_id) references dataset (id) on update CASCADE on delete CASCADE,
  constraint user_label_interaction_user_id_fkey foreign KEY (user_id) references auth.users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

create unique INDEX IF not exists ux_uli_user_dataset on public.user_label_interaction using btree (user_id, dataset_id) TABLESPACE pg_default;

create unique INDEX IF not exists ux_uli_one_active_start_per_user on public.user_label_interaction using btree (user_id) TABLESPACE pg_default
where
  ((status)::text = 'started'::text);