# Self-Hosting

Each Jury Duty deployment is built around one dataset. You run your own copy, load your posts, invite raters, and export the results.

It takes about 30 minutes. You'll need free accounts on [Supabase](https://supabase.com), [Vercel](https://vercel.com) and [Google Cloud](https://console.cloud.google.com), plus [Node.js 24](https://nodejs.org) and the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).

## 1. Fork the repo

Fork [jury-duty](https://github.com/mdhishaamakhtar/jury-duty) and clone your fork. Your question, guidelines and sample posts live in your copy.

## 2. Create the database

Create a new Supabase project. Then link it and apply the schema from the repo root:

```bash
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

The project ref is in your Supabase project's URL.

## 3. Set up Google sign-in

1. In Google Cloud, create an OAuth client of type **Web application**.
2. Add this as an authorized redirect URI:

   ```text
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

3. In Supabase, open **Authentication → Sign In / Providers → Google**, turn it on, and paste the client ID and secret.

## 4. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmdhishaamakhtar%2Fjury-duty&root-directory=frontend&env=PUBLIC_SUPABASE_URL,PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&envDescription=Find%20these%20in%20your%20Supabase%20project%20settings&project-name=jury-duty&repository-name=jury-duty)

The button creates a new repo, so if you forked already, import your fork in Vercel instead and set **Root Directory** to `frontend`.

Add these environment variables:

| Name                        | Where to find it                         |
| --------------------------- | ---------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | Supabase project settings, API           |
| `PUBLIC_SUPABASE_ANON_KEY`  | Supabase project settings, API           |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings, API. Keep this secret. |

The server key can read and write everything, so never put it in a variable that starts with `PUBLIC_`.

Set the region in `frontend/vite.config.ts` to the [Vercel region](https://vercel.com/docs/regions) closest to your database. It's set to Mumbai (`bom1`) by default. Your deployment will load slowly if the two are far apart.

## 5. Allow your site in Supabase

In Supabase, open **Authentication → URL Configuration**.

- Set **Site URL** to your site, like `https://labels.example.com`.
- Add your callback under **Redirect URLs**:

  ```text
  https://labels.example.com/callback
  ```

## 6. Write your guidelines

Edit `frontend/src/lib/jury.config.ts`:

- `headline`, `lead` and `footerNote` for the landing page.
- `guidelines` for your question, what TRUE and FALSE mean, and the rules raters follow.
- `samples` for the landing page and public demo. Keep these made up, because anyone can see them.

Every verdict is TRUE or FALSE, so phrase your question that way.

## 7. Load your posts

Make a CSV with a `content` column. Other columns are ignored.

```csv
content
"The first post to label"
"The second post, which can contain, commas and
several lines"
```

Create `frontend/.env` from `frontend/.env.example`, using your project's values, then run:

```bash
cd frontend
npm install
npm run import -- posts.csv
```

The import stops if the project already has posts. Add `--append` to add more. Posts support Reddit-style bold, italics, quotes and links.

## 8. Make yourself an owner

Owners label like everyone else, and also get the Results page. Sign in once on your site, then run this in the Supabase SQL editor:

```sql
insert into public.project_owners (user_id)
select id from auth.users where email = 'you@example.com';
```

Repeat it for each owner. To remove one:

```sql
delete from public.project_owners
where user_id = (select id from auth.users where email = 'you@example.com');
```

## 9. Invite raters

Share your site's link. Raters sign in with Google and start labeling. Each rater sees each post at most once.

**Anyone with a Google account who has the link can sign in and label.** If that's a problem, publish your Google OAuth client in testing mode with a list of allowed users, or restrict it to your Google Workspace.

## Reading the results

The Results page shows progress, inter-rater agreement, each rater pair, each rater's TRUE rate, and the posts raters disagreed on. **Download CSV** exports every verdict with its post.

Agreement can only be measured on posts with at least two raters. Posts get a second rater after every post has its first, so plan for that if you need agreement scores.

| Measure | What it tells you |
| ------- | ----------------- |
| Percent agreement | How often two raters match. Doesn't correct for chance. |
| Krippendorff's α | The main score. Corrects for chance and allows any number of raters per post. Aim for 0.67 or above, and 0.80 for firm conclusions. |
| Scott's π / Fleiss' κ | Chance-corrected agreement when every post has the same number of raters. |
| Cohen's κ | Agreement between one pair of raters. |
| Gwet's AC1 | Stays stable when one label is much rarer than the other. |
| PABAK | Agreement with label balance and rater bias removed. |
| Positive and negative agreement | How reliable TRUE and FALSE are on their own. |

## Updating

Pull the latest changes into your fork, then apply any new migrations:

```bash
supabase db push
```

Vercel redeploys when you push to your main branch. Back up your database before applying migrations.
