# PJAZZA — Use Cases & Functional Reality Check

**Purpose:** Define what PJAZZA is, who can use it, and whether each use case actually works end-to-end.

---

## What PJAZZA Is Selling

PJAZZA is Malta's live shopping marketplace. Businesses go live (stream or video call), consumers discover, watch, and buy — with escrow protection. PJAZZA takes commission on every transaction.

---

## 1. Main Use Case (The One That Matters Most)

**Live video commerce in Malta**

A business owner in Malta goes live (stream or 1:1 video call). A consumer discovers them, watches, and buys or books — with payment held in escrow until the consumer approves. The business gets paid; PJAZZA keeps commission.

**Who benefits:** Business owners, tourists, expats, Maltese locals.

**Is it functional?** Partially. Go-live, discovery, and video calls exist. The breakpoints: Supabase env vars in production, claiming/creating a business, Stripe Connect for payments. If env vars are set and the user has claimed or created a business, the flow can work. Many users hit "Something went wrong" because env vars were missing or flows threw before we fixed them.

---

## 2. Top 5 Use Cases (Priority)

| # | Use Case | Who | Functional? | How to Use | Blockers |
|---|----------|-----|-------------|------------|----------|
| 1 | **Go live → appear in discover** | Business owner | ✅ Yes (if env vars set) | Dashboard → GO LIVE → Accept live video calls. Stream appears in /pjazza/discover and /pjazza/live-shop. | Supabase, LiveKit env vars; user must have claimed/created business |
| 2 | **List and sell products** | Business owner | ✅ Yes (if env vars set) | Dashboard → Manage products → Add product. Products show on store page. | Supabase; user must have business; POST /api/products |
| 3 | **Book restaurant/experience** | Consumer | ✅ Yes (if Stripe configured) | Discover → biz page → Booking flow → pay escrow. | Stripe Connect; business must have stripe_account_id |
| 4 | **Video call a store** | Consumer + business | ✅ Yes (if LiveKit configured) | Store page → Connect live → 1:1 video. Business accepts on /pjazza/business/live. | LiveKit env vars; business must be "live" |
| 5 | **Upload video as stream** | Business owner | ✅ Yes (if Supabase Storage configured) | Dashboard → Upload video → Publish to Store. Video loops on store page. | Supabase Storage bucket `stream-videos`; RLS |

---

## 3. All Use Cases (Full List)

| Use Case | Who | Functional? | How to Use | Notes |
|----------|-----|-------------|------------|-------|
| Claim existing business | Business owner | ✅ | Onboard → search → Claim | Requires business in DB |
| Create new business | Business owner | ✅ | Onboard → List your business as new | POST /api/businesses |
| Go live (stream) | Business owner | ✅ | Dashboard → GO LIVE → /pjazza/business/live | Creates stream, sets is_live |
| Upload video | Business owner | ✅ | Stream page → Upload → Publish to Store | Supabase Storage |
| Manage products | Business owner | ✅ | Dashboard → Manage products | Was broken; needs Supabase env vars |
| Subscription plans | Business owner | ✅ | Dashboard → Subscription | Was broken; needs Supabase + Stripe |
| Business settings | Business owner | ✅ | Dashboard → Business settings | Was broken; needs Supabase |
| Incoming bookings | Business owner | ✅ | Dashboard → Incoming bookings | GET /api/bookings?business_id |
| Capture payment | Business owner | ✅ | Dashboard → Capture button | POST /api/bookings/[id]/capture |
| Add photo proof | Business owner | ✅ | Dashboard → Add proof | PATCH booking with seller_photo_url |
| Discover businesses | Consumer | ✅ | /pjazza or /pjazza/discover | getStores / mock fallback |
| Browse live-shop | Consumer | ✅ | /pjazza/live-shop | getStores |
| View store detail | Consumer | ✅ | /pjazza/live-shop/[slug] | getStoreBySlug |
| Book (restaurant, tour) | Consumer | ✅ | Biz page → Booking flow | Stripe Connect |
| Photo-verified purchase | Consumer | ✅ | Biz page → buy product → approve | Add proof + Approve flow |
| Approve booking (consumer) | Consumer | ✅ | /profile → My Bookings → Approve | POST /api/bookings/[id]/approve |
| Video call store | Consumer | ✅ | Store page → Connect live | LiveKit |
| Search | Consumer | ✅ | SearchBar → /search?q=... | GET /api/search |
| Profile / My Bookings | Consumer | ✅ | /profile | GET /api/bookings?consumer=1 |
| Leave review | Consumer | ✅ | Profile → Leave review | POST /api/reviews |
| Cruise arrivals on dashboard | Business owner | ✅ | Dashboard shows next cruise | GET /api/cruise-arrivals |
| Dietary/accessibility filters | Consumer | ✅ | Profile → toggles | Filters discover |
| Tier filter (Luxury/Value/Deals) | Consumer | ✅ | Discover tier selector | Filters streams |
| Community boards | Consumer | ✅ | /pjazza/community | Static links |
| Magazine | Consumer | ✅ | /pjazza/magazine | Static content |
| Currency converter | Consumer | ✅ | Checkout display | Static rates |
| PWA install | All | ✅ | Install prompt | manifest.json |
| Stripe Connect onboarding | Business owner | ✅ | Dashboard → Connect Stripe | POST /api/stripe/connect |
| Health check | Ops | ✅ | GET /api/health | DB reachable |

---

## 4. Why Users Leave Disappointed

**Root causes:**

1. **Missing Vercel env vars** — Supabase, Stripe, LiveKit. Without them, createClient() throws, fetch fails, pages show "Something went wrong". **Fix:** Add env vars in Vercel, redeploy.
2. **Empty DB** — No businesses, no products. Discover shows mock or empty. **Fix:** Run seed migrations 002, 005, 006.
3. **User has no business** — Manage products, Subscription, Settings call `/api/businesses?mine=1`. If user hasn't claimed or created a business, they see "Claim a business first" or empty state. If createClient() throws before that, they see error.
4. **Stripe not connected** — Bookings require Stripe Connect. Business must complete Connect flow.

---

## 5. Satisfaction Check: Can They Get What They Want?

| User type | Want | Can they? | If not, why |
|-----------|------|-----------|-------------|
| Business owner | List my business | ✅ Yes — onboard, claim or create | DB empty, or env vars missing |
| Business owner | Go live | ✅ Yes — if business claimed | Env vars, LiveKit |
| Business owner | Add products | ✅ Yes | Env vars, business |
| Business owner | Get paid | ✅ Yes — Stripe Connect + capture | Connect flow, stripe_account_id |
| Business owner | See earnings | ✅ Yes — dashboard | Env vars |
| Consumer | Discover stores | ✅ Yes | Mock or real data |
| Consumer | Book restaurant | ✅ Yes | Stripe, business has Connect |
| Consumer | Video call store | ✅ Yes | LiveKit, business is live |
| Consumer | Buy product with escrow | ✅ Yes | Photo proof + approve flow |
| Consumer | See my bookings | ✅ Yes — /profile | Env vars |

---

## 6. What Must Work for "Life Depends on It"

1. **Supabase env vars in Vercel** — Without them, almost every page that touches DB throws.
2. **Seed data** — At least 002 so businesses appear. Otherwise discover is empty or mock-only.
3. **Claim or create business** — User must have a business to use Manage products, Subscription, Settings, Go live.
4. **Stripe Connect** — For bookings and payouts.
5. **LiveKit** — For video calls.

**Bottom line:** The code exists. The flows are wired. The block is env/config and data. Once Vercel has env vars, migrations are run, and the user has a business, they can use the app end-to-end.
