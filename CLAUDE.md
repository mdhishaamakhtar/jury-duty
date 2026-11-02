# Jury Duty

A self-hosted multi-rater data labeling app. One SvelteKit app in `frontend/` is both the frontend and the backend, deployed on Vercel. Supabase provides Postgres and Google sign-in. Schema lives in `supabase/migrations/`.

## Rules

- **Production data must never change.** Don't run UPDATE, DELETE, TRUNCATE or DROP on `dataset` or `user_label_interaction` in production. Migrations stay additive.
- Before any production migration, take a backup, compare fingerprints before and after, and get the user's approval.
- Never point tests at production. The Playwright setup refuses anything except a local Supabase.
- No native browser UI: no `alert`, `confirm`, `prompt` or stock `<select>`. Build it in the app's design.
- Don't change `get_next_unlabeled_post` without asking. It is the assignment logic that the existing labels came from.
- New tables need explicit `grant` statements for `service_role`. New Supabase projects don't grant them automatically.
- Anything specific to one deployment belongs in `frontend/src/lib/jury.config.ts`.

## Run locally

Needs Docker and the Supabase CLI. From the repo root:

```bash
export GOOGLE_CLIENT_ID=local GOOGLE_CLIENT_SECRET=local
supabase start -x studio,imgproxy,storage-api,realtime,edge-runtime,logflare,vector,mailpit,postgres-meta,supavisor
supabase status -o env
```

`supabase start` applies every migration, which also proves a fresh install works. Use `supabase db reset --local` to start over.

Put the local values in `frontend/.env`, using `.env.example` as the template:

```bash
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY>
```

Then, from `frontend/`:

```bash
npm install
npm run dev
```

Google sign-in won't work locally with these placeholder values. `/demo` needs no sign-in. For signed-in pages, use the end-to-end tests, which create real local sessions.

To load posts into the local database:

```bash
npm run import -- posts.csv
```

To make a local user an owner:

```sql
insert into public.project_owners (user_id)
select id from auth.users where email = 'you@example.com';
```

## Test

From `frontend/`:

```bash
npm run verify
```

This runs Prettier, ESLint, type checks, unit tests and the production build. CI runs it on every push.

End-to-end tests need the local Supabase running:

```bash
eval "$(cd .. && supabase status -o env | grep -E '^(ANON_KEY|SERVICE_ROLE_KEY)=')"
E2E_ANON_KEY=$ANON_KEY E2E_SERVICE_KEY=$SERVICE_ROLE_KEY npm run test:e2e
```

They run on desktop and phone sizes, and create their own users and synthetic posts. They need an empty or disposable database.

Statistics in `src/lib/agreement.ts` must stay checked against an independent source. If a formula changes, add a hand-worked test in `agreement.test.ts`.

## Code notes

- SvelteKit 3 uses `#lib/...` imports, not `$lib`. Non-Svelte imports need the file extension, like `#lib/types.ts`.
- Environment variables are declared and validated in `src/env.ts`, and imported from `$app/env/public` or `$app/env/private`.
- External redirects need `redirect(303, url, { external: [origin] })`.
- Database calls live in `src/lib/server/database.ts`. The browser never talks to the database directly.
- Labeling behaviour lives in `src/lib/labeling.svelte.ts`, which `/label` and `/demo` share.
- `/callback` must stay one path segment so it matches Supabase's single-star redirect patterns.
