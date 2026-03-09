<p align="left">
  <img src="./frontend/static/og-image.svg" alt="Jury Duty Logo" width="220">
</p>

## Jury Duty

Jury Duty is a data labeling engine for coordinated multi-rater annotation.

Each deployment is built around a single dataset: you host your own instance, load the data into Postgres, invite contributors, and collect labels in a structured format ready for IRR and downstream analysis.

It is designed for teams running their own annotation workflow, not a shared upload-anything platform.

## What It Does

- Assigns unlabeled items to contributors without collisions
- Stores every label in Postgres with the metadata needed for analysis
- Supports multiple raters on the same dataset
- Makes the resulting data usable for IRR, agreement checks, bias analysis, and custom research workflows

## Tech Stack

[![SvelteKit](https://img.shields.io/badge/SvelteKit-5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Platform-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Deno](https://img.shields.io/badge/Deno-Edge_Functions-000000?style=for-the-badge&logo=deno&logoColor=white)](https://deno.com/)

## Quick Start

### 1. Start Supabase

```bash
cd backend
npx supabase start
npx supabase db push
npx supabase functions deploy
```

### 2. Run the frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local` with:

```bash
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then start the app:

```bash
npm run dev
```

## Project Docs

- Backend: [backend/README.md](./backend/README.md)
- Frontend: [frontend/README.md](./frontend/README.md)
- API: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Contributors

- Md Hishaam Akhtar
- Pranav Raghav
