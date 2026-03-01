# PJAZZA Senior Developer Verification Checklist

Run this before saying "everything works". Check each item; fix before deploying.

---

## 1. Build & Lint

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes (if configured)
- [ ] No TypeScript errors
- [ ] No console errors during build

---

## 2. Supabase

- [ ] Migrations 001–021 run in Supabase SQL Editor (or `supabase db push`)
- [ ] `run_015_to_020.sql` applied if 015–020 not yet run
- [ ] `021_profiles_insert_and_business_create.sql` applied — fixes “cannot create business”
- [ ] Seed data (002, 005, 006) run if DB empty — businesses, products, streams
- [ ] RLS policies correct: `010_claim_business_rls` for claiming
- [ ] Storage bucket `stream-videos` exists (003_storage_bucket)
- [ ] Auth → URL config: production URL + redirect URLs added

---

## 3. Environment Variables (Vercel / Production)

**Required for core:**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (e.g. https://www.maltaverse.live)

**Required for auth & business flows:**

- `SUPABASE_SERVICE_ROLE_KEY` (admin APIs if used)

**Required for payments:**

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO` (subscriptions)

**Required for live video:**

- `NEXT_PUBLIC_LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

**Optional (enrichment, admin):**

- `ADMIN_IMPORT_SECRET`
- `GOOGLE_PLACES_API_KEY`
- `OPENAI_API_KEY`
- `CLOUDFLARE_STREAM_*`, `ABLY_*`

---

## 4. Critical Paths (Manual Test)

- [ ] Visit `/pjazza` — loads, shows businesses (mock or real)
- [ ] Visit `/pjazza/business/dashboard` — redirects to `/pjazza/agent` if not logged in
- [ ] Visit `/pjazza/business/onboard` — loads (no redirect)
- [ ] Sign in → dashboard loads
- [ ] Claim/create business → appears in dashboard
- [ ] Go live → stream created, `is_live` set
- [ ] End live → stream ended, `is_live` cleared
- [ ] Upload video → publish to store → appears on store page
- [ ] `/api/health` → 200, `{ status: "ok", db: "reachable" }`

---

## 5. Deployment

- [ ] Vercel project linked to correct repo (`pjazza` or `pjazza-vercel`)
- [ ] Branch `main` auto-deploys
- [ ] All env vars set in Vercel (not just `.env.example`)
- [ ] Last deploy succeeded (check Vercel dashboard)
- [ ] Live URL works: https://www.maltaverse.live

---

## 6. Common Failure Modes

| Symptom | Likely cause |
|--------|---------------|
| "Something went wrong" on dashboard | Supabase env vars missing, or `useSearchParams` without Suspense (fixed) |
| 0 businesses, empty discover | DB empty — run seed migrations 002, 005, 006 |
| Go live doesn't appear | POST /api/streams failing, or LiveKit env vars missing |
| Can't create business | Run migration 021; ensure profile exists (API now upserts profile first) |
| Stripe Connect fails | Stripe env vars, redirect URL in Stripe Dashboard |

---

## Quick Commands

```bash
npm run build          # Verify build
npm run dev            # Local test
# Supabase: SQL Editor → run 001–020, then 002, 005, 006 for seed
```
