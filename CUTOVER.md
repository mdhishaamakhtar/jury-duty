# Cutover checklist

Rules: never run UPDATE, DELETE or DROP against existing rows. Compare row counts before and after every database step.

## Before go-live

- [ ] Review and apply `backend/supabase/migrations/20261102000000_verdict_flow.sql`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (server only)
- [ ] Set the Supabase Auth Site URL to `https://juryduty.hishaam.dev` (it is still `http://localhost:3000`)
- [ ] Narrow the Supabase redirect pattern `https://*.vercel.app/*` to this project's preview URLs
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to the Vercel production environment
- [ ] Set the Vercel function region to Mumbai (`bom1`)
- [ ] Test the preview with a throwaway account

## After go-live

- [x] Delete the Supabase edge functions `get_next_datapoint` and `label_data`
