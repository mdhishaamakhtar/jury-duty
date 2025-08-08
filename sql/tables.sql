create table public.dataset (
    id uuid not null,
    content text null,
    label text null,
    constraint dataset_pkey primary key (id)
) TABLESPACE pg_default;

create table public.user_label_interaction (
    id uuid not null default gen_random_uuid (),
    user_id uuid null,
    dataset_id uuid null,
    label text null,
    status character varying(20) null default 'completed' :: character varying,
    constraint user_label_interaction_pkey primary key (id),
    constraint user_label_interaction_dataset_id_fkey foreign KEY (dataset_id) references dataset (id) on update CASCADE on delete CASCADE,
    constraint user_label_interaction_user_id_fkey foreign KEY (user_id) references auth.users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;