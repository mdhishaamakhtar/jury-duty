<!-- markdownlint-disable MD033 -->

<p align="center">
  <img src="./.github/assets/jury-duty-preview.png" alt="Jury Duty: every post gets a fair hearing">
</p>

## Jury Duty

Jury Duty is a data labeling engine for coordinated multi-rater annotation.

Each deployment is built around a single dataset: you host your own instance, load your posts, invite raters, and collect independent TRUE or FALSE verdicts ready for agreement analysis.

[juryduty.hishaam.dev](https://juryduty.hishaam.dev) is one deployment of it, running a real research dataset. [Try the demo](https://juryduty.hishaam.dev/demo) with made-up posts, no sign-in needed.

## What It Does

- Assigns posts to raters without collisions, and shows each rater a post at most once
- Saves every verdict safely, with undo for a recent mistake
- Works by click, tap or keyboard, on desktop and phone
- Keeps the written guidelines one click away while labeling
- Gives owners a results page with inter-rater agreement, rater pairs and disagreements
- Exports every verdict to CSV for downstream analysis

## Tech Stack

[![SvelteKit](https://img.shields.io/badge/SvelteKit-3-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/docs/kit)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Playwright](https://img.shields.io/badge/Playwright-Tests-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

## Self-Hosting

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmdhishaamakhtar%2Fjury-duty&root-directory=frontend&env=PUBLIC_SUPABASE_URL,PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&envDescription=Find%20these%20in%20your%20Supabase%20project%20settings&project-name=jury-duty&repository-name=jury-duty)

Follow the [self-hosting guide](./docs/self-hosting.md) to set up your own deployment with your own data. It covers the database, Google sign-in, your guidelines, importing posts and adding owners.

## Quick Start

You'll need Docker, Node.js 24 and the Supabase CLI.

```bash
export GOOGLE_CLIENT_ID=local GOOGLE_CLIENT_SECRET=local
supabase start
supabase status -o env
```

Copy `frontend/.env.example` to `frontend/.env` and fill in the local values, then start the app:

```bash
cd frontend
npm install
npm run dev
```

Open [localhost:5173/demo](http://localhost:5173/demo).

## Contributors

- Md Hishaam Akhtar

## License

[MIT](./LICENSE)
