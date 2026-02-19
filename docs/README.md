# PJAZZA

**Malta's transaction layer for local discovery and commerce.**

PJAZZA connects buyers and sellers across Malta through live video, verified trust signals, and escrow-protected payments. It serves 3.8M annual tourists, 540K residents, and every business category on the island.

---

## What This Product Is

PJAZZA is a marketplace platform where:

1. **Businesses** go live on video, accept bookings, sell products, and receive escrow-protected payments
2. **Consumers** (tourists, expats, locals) discover businesses through live streams, verified trust scores, crowd data, and AI recommendations — then book, buy, or hire in under 30 seconds
3. **PJAZZA** takes a commission on every transaction that flows through the platform

The core mechanism is **trust-as-a-service**: we aggregate and surface trust signals (multi-platform reviews, live video, photo-verified transactions, crowd intelligence, atmosphere cameras) so that strangers can transact with confidence.

## What This Product Is Not

- Not a social media app. There are no followers, no feeds, no content for content's sake.
- Not a clone of VisitMalta. VisitMalta is a static tourism brochure. PJAZZA is a live transaction platform.
- Not a TikTok Shop competitor. TikTok Shop is not available in Malta. We are the live commerce layer for a market global platforms will never serve.
- Not a review platform. Reviews are an input to our trust score, not the product itself.
- Not a delivery company. We partner with existing logistics (Bolt Delivery, local couriers) for fulfilment.

## Who It Is For

### Consumers

| Segment | Size | Primary Need |
|---|---|---|
| Tourists | 3.8M/year | Discover and book experiences, restaurants, tours in an unfamiliar country. Need instant trust signals. |
| Expats | ~80K in Malta | Find reliable services (plumbers, electricians), rental properties, and local businesses. Need verified quality. |
| Maltese locals | 540K residents | Book services, shop local, compare venues. Need transparency on crowd levels, pricing, quality. |

### Businesses

| Category | Count in Malta | Primary Need |
|---|---|---|
| Restaurants / Cafés / Bars | 2,000+ | Fill empty seats, especially from tourist traffic. Reduce no-shows. |
| Real Estate Agents | 400+ | Show properties to remote expats. Reduce no-show viewings. |
| Yacht Charter / Brokers | ~50-100 | Sell high-value charters (€5K-50K) without flying prospects to Malta. |
| Car Dealers / Private Sellers | 200+ dealers | Prove vehicle condition remotely. Reduce tyre-kickers. |
| Freelance Tradespeople | 1,000+ | Prove skills, get guaranteed payment, build verified portfolio. |
| Retail / Artisan Shops | 500+ | Reach tourists who don't know they exist. Sell and deliver to hotels. |
| Spas / Salons / Wellness | 300+ | Show real work quality. Eliminate no-shows via escrow deposits. |
| Tour Guides / Experiences | 400+ | Escape Airbnb's 20% commission. Let tourists preview tour quality. |

## Core Value Proposition

**For consumers:** See it live, trust it instantly, book in 3 taps, money protected.

**For businesses:** Go live in 10 seconds, get paid guaranteed, keep more of your revenue than on any other platform.

**For PJAZZA:** Commission on every transaction across every business category on a 316 km² island with a captive market of 3.8M annual visitors who must spend money.

## Technical Stack (Production Target)

| Layer | Technology | Rationale |
|---|---|---|
| Mobile | React Native (Expo) | Cross-platform, single codebase |
| Web | Next.js 14+ (App Router) | SEO, SSR, PWA for no-download tourist access |
| Backend | Supabase (PostgreSQL + Auth + Realtime + Storage) | Fastest path to production for small team |
| Video/Streaming | LiveKit (WebRTC) | Open-source, sub-second latency, self-hostable |
| Payments | Stripe Connect (manual payouts) | Escrow-like holds, marketplace splits, EU/Malta compliant, avoids Payment Institution license |
| CDN/Storage | Cloudflare R2 + CDN | Stream delivery, replay storage, static assets |
| AI | OpenAI API + Whisper | Sentiment analysis, auto-translation, smart clip generation |
| Analytics | PostHog | Self-hostable, product analytics, funnel tracking |

## Repository Structure (Target)

```
pjazza/
├── apps/
│   ├── web/          # Next.js 14 web app (PWA)
│   └── mobile/       # React Native (Expo) app
├── packages/
│   ├── db/           # Supabase schema, migrations, types
│   ├── ui/           # Shared component library
│   └── config/       # Shared config (ESLint, TypeScript)
├── docs/
│   ├── README.md     # This file
│   ├── PRD.md        # Product requirements
│   └── SCOPING.md    # V1 scope and phasing
└── supabase/
    ├── migrations/   # Database migrations
    └── functions/    # Edge functions
```

## Status

Pre-production. Strategy validated across 5 strategy documents. Interactive prototypes built (4 iterations, 2,700+ lines of React). Corporate business plan completed. Moving to production codebase.

## Constraints

- Malta-only for Year 1. No internationalisation until model is proven.
- PWA-first for tourist acquisition (no App Store download friction). Native app for business users.
- Stripe Connect for payments — explicitly avoids needing an MFSA Payment Institution license.
- GDPR compliance is non-negotiable. Atmosphere cameras require DPIA, explicit consent, AI face-blurring, business opt-in.
- Tourist data auto-deletes 30 days after last activity in Malta.