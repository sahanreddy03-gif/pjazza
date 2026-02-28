# PJAZZA Build Phases

Master Build Document reference. Execute phases in order; verify each phase works before proceeding.

---

## Phase 0 — Foundation ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Project setup | ✅ | Next.js 16, App Router |
| Packages | ✅ | Supabase, Stripe, LiveKit, Ably, OpenAI, date-fns |
| Env | ✅ | `.env.example` template; fill `.env.local` |
| DB schema | ✅ | migrations 001–009; run `supabase db push` |
| Auth middleware | ✅ | Protects `/pjazza/business/*` except onboard; redirect → `/pjazza/agent` |
| Supabase libs | ✅ | client.ts, server.ts, middleware.ts |

### Verify Phase 0

1. **App runs**  
   `npm run dev` → visit https://localhost:3000/pjazza

2. **DB connection**  
   Visit `/pjazza/discover` or `/pjazza/live-shop` — should load businesses from Supabase

3. **Auth middleware (business owner)**  
   - Not logged in → visit `/pjazza/business/dashboard`  
   - Expected: redirect to `/pjazza/agent?redirect=/pjazza/business/dashboard`

4. **Onboard stays public**  
   - Visit `/pjazza/business/onboard`  
   - Expected: page loads (no redirect)

5. **Contact flow (customer)**  
   - Visit `/pjazza/contact` → submit form  
   - Expected: submission stored in `contact_submissions`

### Migrations

```bash
# If using Supabase CLI
supabase db push

# Or run 008, 009 manually in Supabase SQL Editor if 001–007 already applied
```

---

## Phase 1 — Auth, Onboarding, Stripe Connect ✅ DONE

- [x] Supabase Auth sign-up / sign-in
- [x] Wire `/pjazza/agent` to real auth
- [x] Business onboarding flow (claim listing)
- [x] Stripe Connect onboarding
- [x] Profiles trigger (008) creates profile on sign-up
- [x] RLS policy (010) for claiming unclaimed businesses

### New migration: run 010_claim_business_rls.sql in Supabase SQL Editor

---

## Phase 2 — Core Features ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Bookings schema (011) | ✅ | commission, date, time, guests, notes |
| Bookings auth + Stripe Connect | ✅ | POST requires auth, uses transfer_data when business has stripe_account_id |
| Bookings capture API | ✅ | POST /api/bookings/[id]/capture — release escrow |
| Bookings list API | ✅ | GET ?business_id=... or ?consumer=1 |
| LiveKit auth | ✅ | store-* rooms require owner ownership |
| Business /live | ✅ | Only shows owner's businesses (?mine=1) |
| Business profile PATCH | ✅ | PATCH /api/businesses/[id] |
| Product CRUD | ✅ | POST /api/products, PATCH/DELETE /api/products/[id] |
| Products page | ✅ | /pjazza/business/products |
| Industry commission mapping | ✅ | INDUSTRY_TO_CONFIG for DB industry values |

### Migrations to run
- 011_bookings_extended.sql
- 012_bookings_rls_business_read.sql

---

## Phase 3 — Consumer & Business Flows ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Consumer booking on biz page | ✅ | BookingCard wraps BookingFlow, sign-in prompt when not logged in |
| Industry mapping for booking type | ✅ | Expanded INDUSTRY_TO_BOOKING_TYPE |
| Consumer video call (store-* rooms) | ✅ | Customers can join; staff tokens require ownership |
| Incoming bookings on dashboard | ✅ | Real data from /api/bookings?business_id=... |
| Capture button | ✅ | Release escrow for pending bookings |
| Real earnings (this month) | ✅ | Sum of completed bookings |
| Connect live link on biz page | ✅ | When is_live, link to /pjazza/live-shop/[slug] |

---

## Phase 4 — Consumer My Bookings, Cruise Arrivals, Business Settings ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Consumer My Bookings | ✅ | /profile — lists from GET /api/bookings?consumer=1 |
| Cruise arrivals on dashboard | ✅ | CruiseShipAlert fetches from /api/cruise-arrivals |
| Business settings | ✅ | /pjazza/business/settings — edit name, description, locality, address, phone, website |
| Settings link on dashboard | ✅ | "Business settings" button in dashboard |

### Verify Phase 4

1. **Consumer My Bookings**  
   - Sign in as consumer → visit /profile  
   - Expected: list of own bookings (amount, type, status)

2. **Cruise arrivals**  
   - Visit /pjazza/business/dashboard (owner)  
   - Expected: next cruise from `cruise_arrivals` shown (ship name, arrival time, best live window)

3. **Business settings**  
   - Owner → dashboard → Business settings  
   - Edit name, description, etc. → Save  
   - Expected: PATCH succeeds, redirect to dashboard

---

## Phase 5 — Reviews & Photo Verification ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Native reviews | ✅ | Migration 013, `reviews` table, POST/GET /api/reviews |
| Post-booking review | ✅ | Profile: Leave review for completed bookings |
| PJAZZA reviews on biz page | ✅ | Display native reviews below Trust Score |
| Consumer approve | ✅ | POST /api/bookings/[id]/approve — product/service, after proof |
| Business photo proof | ✅ | PATCH /api/bookings/[id] — owner sets seller_photo_url |
| Dashboard Add proof | ✅ | For product/service pending: Add proof (URL) instead of Capture |
| Profile Approve button | ✅ | Approve & release when seller has uploaded proof |

### Migration to run
- 013_reviews_and_photo_proof.sql

### Verify Phase 5

1. **Native reviews**  
   - Complete a booking → Profile → Leave review (star + text)  
   - Visit biz page → PJAZZA Reviews section shows

2. **Photo verification (product/service)**  
   - Create product/service booking (e.g. retail business)  
   - Owner: Dashboard → Incoming bookings → Add proof (paste image URL)  
   - Consumer: Profile → My Bookings → Approve & release

3. **Dining/tour**  
   - Business still uses Capture directly (no proof needed)

---

## Phase 6 — Data Enrichment & Integrations ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Migration 013 | ✅ | Run in Supabase SQL Editor if not linked |
| Google Places enrichment | ✅ | POST /api/admin/enrich — photos, ratings, address, phone, website |
| Product scraping | ✅ | POST /api/admin/enrich-products — from business website_url |
| Freelancer import | ✅ | POST /api/admin/import-freelancers — tradespeople, freelancers |
| Cruise arrivals scraper | ✅ | POST /api/admin/enrich-cruise — Valletta Cruise Port |
| Enrich-all orchestration | ✅ | POST /api/admin/enrich-all — runs all pipelines |
| OpenAI descriptions | ✅ | POST /api/admin/enrich-openai — AI business descriptions |
| Cloudflare Stream | ✅ | POST /api/admin/cloudflare-stream-upload — video broadcast |
| Ably presence | ✅ | Helper lib for realtime viewer counts |
| Social/TikTok placeholders | ✅ | Docs for TikTok, Instagram, Meta APIs (require approval) |
| PostHog analytics | ✅ | PostHogProvider when NEXT_PUBLIC_POSTHOG_KEY set |
| Env template | ✅ | .env.example includes all integrations |
| DATA_IMPORT.md | ✅ | Full docs for all enrichment tools |

### Env keys to add

- `ADMIN_IMPORT_SECRET` — protect admin routes
- `GOOGLE_PLACES_API_KEY` — business photos, ratings, address
- `OPENAI_API_KEY` — AI descriptions
- `CLOUDFLARE_STREAM_ACCOUNT_ID`, `CLOUDFLARE_STREAM_API_TOKEN` — broadcast video
- `NEXT_PUBLIC_ABLY_API_KEY`, `ABLY_API_KEY` — realtime presence
- `NEXT_PUBLIC_POSTHOG_KEY` — analytics (optional)

### Verify Phase 6

1. **Migration 013** — Run in Supabase SQL Editor.
2. **Google Places** — Add key → `POST /api/admin/enrich?secret=...`
3. **Enrich-all** — `POST /api/admin/enrich-all?secret=...` → runs google + products + cruise + openai

---

## Phase 7 — Subscriptions, PWA, Video Presets ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Migration 014 | ✅ | subscription + streaming_streak on businesses |
| Subscription plans | ✅ | /pjazza/business/subscription — Free/Starter/Pro/Enterprise |
| PATCH subscription | ✅ | PATCH /api/businesses/[id] accepts subscription |
| Video recording presets | ✅ | TikTok, Shorts, IG Story, Live, Vibe Cam in stream page |
| Streaming streak | ✅ | GET /api/businesses/[id]/stats — computed from streams |
| Response time SLA | ✅ | avg_response_minutes from bookings (created → completed) |
| PWA install prompt | ✅ | PWAInstallPrompt component |

### Migration to run
- 014_subscription_and_streak.sql

### Verify Phase 7

1. **Subscription page**  
   Owner → dashboard → Subscription → select plan

2. **Stream presets**  
   /pjazza/business/stream → TikTok, Shorts, IG Story, Live, Vibe

3. **Dashboard stats**  
   Stream streak and Avg response shown in QuickStats

4. **PWA install**  
   On supported browsers, install prompt appears

---

## Phase 8 — Stripe Subscriptions, Video Presets, Delivery, Dietary, Push ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Stripe subscriptions | ✅ | POST /api/stripe/subscription — Checkout for Starter/Pro |
| Stripe webhook | ✅ | POST /api/stripe/webhook — updates businesses.subscription |
| Subscription page | ✅ | Upgrade to Starter/Pro → Stripe Checkout; downgrade to Free via PATCH |
| Video recording presets | ✅ | Preset ratio, duration, camera resolution applied in stream page |
| Preset auto-stop | ✅ | IG Story 15s, TikTok 60s, etc. — auto-stops recording |
| Delivery options | ✅ | Hotel / Home / Pickup in BookingFlow for product bookings |
| calculateDelivery | ✅ | Used from commissions.ts — FREE >€50, €5.99 island-wide |
| Dietary filters | ✅ | Halal, Vegan, Gluten-Free toggles in profile |
| profiles.dietary_filters | ✅ | Migration 016 |
| Push notifications | ✅ | usePushNotifications hook — placeholder for FCM/Web Push |
| Migration 015 | ✅ | delivery_method, delivery_fee, delivery_address on bookings |
| Migration 016 | ✅ | dietary_filters on profiles |
| BUILD_PHASES update | ✅ | This section |

### Env keys

- `STRIPE_PRICE_STARTER` — Stripe Price ID (€49/mo)
- `STRIPE_PRICE_PRO` — Stripe Price ID (€149/mo)
- `STRIPE_WEBHOOK_SECRET` — for subscription events

### Migrations to run

- 015_delivery_columns.sql
- 016_profiles_dietary_filters.sql

---

## Phase 9 — Wheelchair Filter, Currency Converter, Community, Magazine ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Wheelchair filter | ✅ | Profile → Accessibility section, profiles.accessibility_filters |
| Migration 018 | ✅ | accessibility_filters TEXT[] on profiles |
| Currency converter | ✅ | CurrencyConverter component, static EUR→GBP/USD rates |
| Checkout display | ✅ | Currency conversion shown in CheckoutModal |
| Community boards | ✅ | /pjazza/community — Indian, Muslim, Digital Nomad, British (links to WhatsApp/Telegram) |
| PJAZZA Magazine | ✅ | /pjazza/magazine — static editorial (sunset spots, street food, hidden beaches) |
| Footer links | ✅ | Community and Magazine in footer |
| BUILD_PHASES update | ✅ | This section |

### Migration to run

- 018_profiles_accessibility.sql
- 019_businesses_filters.sql

---

## Phase 9.1 — Functional Fixes & Automation ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Dietary & accessibility filters in discover | ✅ | GET /api/streams auto-applies profile dietary_filters, accessibility_filters when logged in |
| Tier filter in discover | ✅ | TierSelector → Luxury/Value/Deals filters by price_tier |
| Subscription stream limits | ✅ | Free: 3/month. GET /api/businesses/[id]/stream-allow. Enforced before Publish to Store |
| Commission flow | ✅ | Verified: transfer_data sends net_business_amount only; PJAZZA keeps commission |
| Migration 019 | ✅ | businesses: dietary_tags, wheelchair_accessible, price_tier |
| BUILD_PHASES update | ✅ | This section |

### Verify Phase 9.1

1. **Discover filters** — Sign in, set dietary (Halal) and accessibility (Wheelchair) in Profile. Visit /pjazza/discover. Live Now section filters by your preferences (when businesses have these tags).
2. **Tier filter** — Select Luxury, Value, or Deals. Live Now updates.
3. **Stream limit** — Free business, 3 streams this month. Publish to Store → upgrade prompt.
4. **Commission** — Check Stripe: full amount held, net transferred to business on capture.

---

## Phase 10 — Business Settings, Discover Category, Watch Again ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Business settings (price_tier, dietary, wheelchair) | ✅ | /pjazza/business/settings — edit price_tier, dietary_tags, wheelchair_accessible |
| PATCH /api/businesses/[id] | ✅ | Accepts price_tier, dietary_tags, wheelchair_accessible |
| Discover category page | ✅ | /discover/[category] — businesses + Watch again replays by category |
| Watch Again section | ✅ | /pjazza/discover — "Watch again" replays with video thumbnails, links to live-shop |
| getReplays() | ✅ | Fetches streams with video_url for Time Machine section |
| BUILD_PHASES update | ✅ | This section |

### Verify Phase 10

1. **Business settings** — Owner → Business settings. Set price tier, dietary tags (Halal, Vegan, Gluten-Free), wheelchair accessible. Save. Discover tier/dietary/accessibility filters apply.
2. **Discover category** — Visit /discover/dining (or tours, property, etc.). See businesses and Watch again replays for that category.
3. **Watch again** — Visit /pjazza/discover. Scroll to "Watch again" section. Past streams with video_url appear; tap → live-shop with replay.

---

## Phase 11 — Search, Crowd Intelligence, Production Readiness ✅ DONE

**Goal:** Meet V1 Definition of Done for Search and Crowd Intelligence; make the app production-ready.

| Task | Status | Notes |
|------|--------|-------|
| Search API | ✅ | GET /api/search?q=... — full-text across businesses, products, streams, categories (all sectors/verticals/branches). |
| Wire SearchBar to Search API | ✅ | Consumer SearchBar — on submit/enter, navigates to /search?q=... . Header Search button → /search. |
| Search results page | ✅ | /search?q=... — categories, businesses, products, streams (Watch again). Links to /biz/[slug], /discover/[category], /pjazza/live-shop/[slug]. |
| Crowd intelligence data | ✅ | Migration 020 adds crowd_pct, crowd_updated_at. POST /api/admin/set-crowd — set crowd_pct for businesses. V1: populate ≥10 via admin. |
| Health check endpoint | ✅ | GET /api/health — returns 200 if DB reachable. For Vercel monitoring, uptime checks. |
| Error boundaries | ✅ | app/error.tsx — catches app crashes, shows Try again + Go home. |
| PWA manifest check | ✅ | manifest.json, icons, theme_color. Install prompt (PWAInstallPrompt) works on mobile. |

### Migrations to run

- 020_crowd_columns.sql — crowd_pct, crowd_updated_at on businesses.

### Verify Phase 11

1. **Search** — Type "restaurant", "Valletta", or "yacht" in SearchBar on /discover. Submit → /search?q=... . Results show categories, businesses, products, streams. Tap result → biz page or live-shop.
2. **Crowd intelligence** — Run migration 020. POST /api/admin/set-crowd?secret=... with body `{ all: true, crowd_pct: 50 }` to seed. Visit /discover — Crowd Intelligence shows businesses with crowd %.
3. **Health check** — `curl /api/health` → 200, `{ status: "ok", db: "reachable" }`.
4. **Error boundary** — Trigger an error (e.g. invalid route) — app shows Try again + Go home.
5. **PWA** — Open on mobile, add to home screen. App loads; install prompt appears.

---

## Phase 11.5 — Deployment & Testing (IN PROGRESS)

**Goal:** Get the app live and verify core flows work.

### Done
- [x] `npm run build` succeeds
- [x] `vercel.json` added
- [x] `supabase/migrations/run_015_to_020.sql` — copy-paste all migrations 015–020 into Supabase SQL Editor in one go

### Supabase
- [ ] Open Supabase Dashboard → SQL Editor → New query
- [ ] Copy contents of `supabase/migrations/run_015_to_020.sql` → Run
- [ ] Add production site URL and redirect URLs in Auth → URL Configuration
- [ ] Confirm RLS policies are correct

### Vercel
- [ ] Connect repo to Vercel (Import Git repository)
- [ ] Add env vars from `.env.example` (see Environment Variables)
- [ ] Deploy — Vercel will run `npm run build` automatically

### Testing (local or deployed)
- [ ] Visit `/api/health` → 200, `{ status: "ok", db: "reachable" }`
- [ ] Visit `/discover` → businesses load
- [ ] Visit `/search?q=restaurant` → results
- [ ] Visit `/biz/[slug]` → business page loads
- [ ] Auth flow: sign in → redirect works

---

## Phase 12 — V1 Launch Prep (follow SCOPING Definition of Done)

- Infrastructure: PWA deployed, Stripe Connect live, LiveKit streaming, SSL/DNS
- Consumer flows: browse, book, buy, video call, search, crowd intelligence
- Business flows: sign up, go live, receive booking, earnings dashboard
- Legal: Privacy Policy, Terms published
