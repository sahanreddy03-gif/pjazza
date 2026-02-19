# PJAZZA — Reference Specification

**Source:** Extracted from 4 prototype iterations (pjazza-prototype.jsx through pjazza-v4.jsx)
**Purpose:** Production reference for data models, screen flows, design system, and business logic.
**Rule:** Do NOT copy prototype patterns (inline styles, single-file components, fake data). Use this as a spec to build proper Next.js + TypeScript + Tailwind + Supabase.

---

## 1. Database Schema (Supabase / PostgreSQL)

### 1.1 Users

```sql
-- Consumer and business users share one auth table (Supabase Auth)
-- Profile data stored separately

CREATE TYPE user_role AS ENUM ('consumer', 'business', 'admin');
CREATE TYPE consumer_tier AS ENUM ('all', 'premium', 'value', 'budget');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'consumer',
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  tier consumer_tier DEFAULT 'all',       -- consumer only
  language TEXT DEFAULT 'en',              -- en, mt, it, fr, de, es
  dietary_filters TEXT[] DEFAULT '{}',     -- halal, vegan, gluten_free
  accessibility_filters TEXT[] DEFAULT '{}', -- wheelchair, sensory_friendly
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2 Businesses

```sql
CREATE TYPE industry_type AS ENUM (
  'dining', 'tours', 'realestate', 'yacht', 
  'cars', 'freelancer', 'retail', 'beauty'
);

CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'pro', 'enterprise');

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry industry_type NOT NULL,
  description TEXT,
  
  -- Location
  address TEXT,
  locality TEXT NOT NULL,          -- Valletta, Sliema, St Julian's, etc.
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  
  -- Display
  emoji TEXT,                      -- business icon
  cover_image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  
  -- Pricing
  price_tier TEXT,                 -- €, €€, €€€
  avg_price TEXT,                  -- "€45/pp", "€18/hr", "€1,350/mo"
  currency_usd TEXT,               -- approximate USD equivalent
  
  -- Trust
  pjazza_rating DECIMAL(2,1) DEFAULT 0,
  pjazza_review_count INT DEFAULT 0,
  google_rating DECIMAL(2,1),
  google_review_count INT,
  tripadvisor_rating DECIMAL(2,1),
  tripadvisor_review_count INT,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  
  -- Tags & Metadata
  tags TEXT[] DEFAULT '{}',        -- "Harbour View", "Chef's Table", "UNESCO"
  vibe JSONB DEFAULT '{}',         -- { music, dress, noise, bestFor }
  
  -- Crowd
  crowd_pct INT DEFAULT 0,         -- 0-100
  crowd_updated_at TIMESTAMPTZ,
  
  -- Dietary / Accessibility
  halal_score INT,                 -- 0, 50, 75, 100
  dietary_tags TEXT[] DEFAULT '{}',
  wheelchair_accessible BOOLEAN DEFAULT FALSE,
  
  -- Subscription
  subscription subscription_tier DEFAULT 'free',
  stripe_account_id TEXT,          -- Stripe Connect account
  
  -- Status
  is_live BOOLEAN DEFAULT FALSE,
  live_viewer_count INT DEFAULT 0,
  stream_room_id TEXT,             -- LiveKit room
  streaming_streak INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.3 Products (Retail / Artisan)

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.4 Services (Freelancers)

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  price_unit TEXT DEFAULT '/hr',    -- /hr, /job, /session
  response_time_min INT,            -- avg response time in minutes
  jobs_completed INT DEFAULT 0,
  portfolio_count INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.5 Bookings

```sql
CREATE TYPE booking_status AS ENUM (
  'pending', 'confirmed', 'escrow_held', 
  'completed', 'approved', 'disputed', 'cancelled', 'refunded'
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID REFERENCES profiles(id),
  business_id UUID REFERENCES businesses(id),
  
  -- Type
  booking_type TEXT NOT NULL,       -- 'table', 'tour', 'property_viewing', 'service', 'product', 'video_call'
  
  -- Details
  date DATE,
  time TIME,
  guests INT,
  notes TEXT,
  
  -- Product/Service reference (if applicable)
  product_id UUID REFERENCES products(id),
  service_id UUID REFERENCES services(id),
  
  -- Money
  amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(4,3),     -- 0.080 = 8%
  commission_amount DECIMAL(10,2),
  net_business_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  
  -- Stripe
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  
  -- Status
  status booking_status DEFAULT 'pending',
  
  -- Photo Verification (for products/services)
  seller_photo_url TEXT,            -- seller uploads proof
  buyer_approved BOOLEAN,
  buyer_approved_at TIMESTAMPTZ,
  
  -- Before/After (for services)
  before_photo_url TEXT,
  after_photo_url TEXT,
  
  -- Delivery (for products)
  delivery_method TEXT,             -- 'hotel', 'home', 'pickup'
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  delivery_address TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.6 Reviews

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  consumer_id UUID REFERENCES profiles(id),
  business_id UUID REFERENCES businesses(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.7 Streams

```sql
CREATE TABLE streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  room_id TEXT NOT NULL,            -- LiveKit room ID
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  peak_viewers INT DEFAULT 0,
  total_viewers INT DEFAULT 0,
  replay_url TEXT,                  -- stored video URL
  preset TEXT,                      -- 'tiktok', 'youtube_shorts', 'ig_story', 'ig_feed', 'live', 'vibe_cam'
  duration_seconds INT,
  is_live BOOLEAN DEFAULT TRUE
);
```

---

## 2. Commission Logic

```typescript
// Commission rates by industry
const COMMISSION_RATES: Record<IndustryType, CommissionConfig> = {
  dining:      { rate: 0.08, minTransaction: 20, cap: null },
  realestate:  { rate: 0.005, minTransaction: 0, cap: null, tourFee: { min: 25, max: 50 } },
  yacht:       { rate: 0.03, minTransaction: 0, cap: null },
  cars:        { rate: 0.01, minTransaction: 0, cap: 200 },
  freelancer:  { rate: 0.10, minTransaction: 0, cap: null },
  retail:      { rate: 0.08, minTransaction: 0, cap: null },
  beauty:      { rate: 0.08, minTransaction: 0, cap: null },
  tours:       { rate: 0.08, minTransaction: 0, cap: null },
};

// Delivery fees
const DELIVERY = {
  sameTown: 3.99,
  islandWide: 5.99,
  freeThreshold: 50,     // FREE delivery over €50
  pjazzaMargin: 0.30,    // 30% of delivery fee
};

// Subscription plans
const SUBSCRIPTIONS = {
  free:       { price: 0,   livePerMonth: 3,    smartClips: 0,  analytics: false, atmosphereCam: false },
  starter:    { price: 49,  livePerMonth: null,  smartClips: 5,  analytics: true,  atmosphereCam: false },
  pro:        { price: 149, livePerMonth: null,  smartClips: null, analytics: true, atmosphereCam: true },
  enterprise: { price: 299, livePerMonth: null,  smartClips: null, analytics: true, atmosphereCam: true },
};
```

---

## 3. Screen Flow Map

```
SPLASH (/)
├── "I'm Exploring" → CONSUMER HOME (/discover)
│   ├── Category Grid → Category Listings (/discover/[category])
│   ├── Live Stream Card → Business Detail (/biz/[slug])
│   │   ├── Watch Live Stream
│   │   ├── Book → Booking Flow → Payment (Stripe) → Confirmation
│   │   ├── Crowd Intelligence
│   │   └── Trust Score + Reviews
│   ├── Shop Tab → Product Grid (/shop)
│   │   ├── Product Detail (/shop/[id])
│   │   │   ├── Buy → Escrow → Photo Verify → Approve → Deliver
│   │   │   └── Video Call Shop
│   │   └── Live Shopping (watch + buy)
│   ├── Services Tab → Freelancer Listings (/services)
│   │   └── Freelancer Detail (/services/[id])
│   │       └── Book → Escrow → Before/After → Approve → Pay
│   ├── Profile (/profile)
│   │   ├── Tier Selection
│   │   ├── Dietary Filters
│   │   └── Language
│   └── Wallet (/wallet)
│       ├── Balance
│       └── Transaction History
│
└── "I'm a Business" → BUSINESS ONBOARDING (/business/onboard)
    └── Select Industry → BUSINESS DASHBOARD (/business/dashboard)
        ├── Go Live / Record (/business/stream)
        │   ├── Platform Presets (TikTok, Shorts, Stories, Feed, Live, Vibe)
        │   ├── Camera Interface
        │   └── Auto-Upload (V2: social export)
        ├── Incoming Requests (/business/requests)
        │   ├── Bookings
        │   ├── Video Call Requests
        │   └── Orders
        ├── Earnings (/business/earnings)
        │   ├── Revenue Breakdown
        │   ├── Commission Deducted
        │   └── Payout Schedule
        ├── Products / Services CRUD (/business/products)
        └── Settings (/business/settings)
            ├── Profile Edit
            ├── Subscription Plan
            └── Stripe Connect Setup
```

---

## 4. Design System (Tailwind Tokens)

### 4.1 Colors

```typescript
// tailwind.config.ts → theme.extend.colors
const colors = {
  // Brand
  pjazza: {
    gold:    '#C4941E',
    honey:   '#D4A843',
    coral:   '#E05A3A',
  },
  
  // Backgrounds
  surface: {
    DEFAULT: '#FAF7F2',    // page bg (warm cream)
    card:    '#FFFFFF',
    alt:     '#F5F0E8',    // secondary card bg
  },
  
  // Text
  ink: {
    DEFAULT: '#2D2A24',    // primary text
    secondary: '#6B6560',
    muted:     '#9C958D',
  },
  
  // Borders
  line: {
    DEFAULT: '#E8E2D8',
    light:   '#F0EBE3',
  },
  
  // Semantic
  trust:   '#1A8A5C',     // verified, approved, escrow safe
  live:    '#E05A3A',     // live indicators, recording
  premium: '#7C3AED',     // yacht, luxury
  info:    '#2563EB',     // property, general info
  warn:    '#D97706',     // moderate crowd, heads-up
  
  // Dark (header bar)
  navy: '#1A1A2E',
};
```

### 4.2 Typography

```
Font: "DM Sans" (Google Fonts) — weights 400, 500, 600, 700, 800
Fallback: system-ui, -apple-system, sans-serif

Sizes:
- Hero title:    text-2xl font-extrabold tracking-tight    (22px, 800)
- Section title: text-base font-extrabold tracking-tight   (16px, 800)  
- Card title:    text-sm font-bold                          (14px, 700)
- Body:          text-xs                                    (12px, 400)
- Caption:       text-[10px] font-semibold                  (10px, 600)
- Micro:         text-[8px] font-semibold                   (8px, 600)
```

### 4.3 Component Patterns

```
Cards:       bg-surface-card border border-line rounded-xl p-3
Badges:      inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
Buttons:     w-full py-3 rounded-xl font-extrabold text-sm
  Primary:   bg-gradient-to-r from-pjazza-gold to-pjazza-honey text-white shadow-lg
  Live:      bg-live text-white (with pulse animation)
  Success:   bg-trust text-white
Progress:    h-1 rounded-full bg-line-light → inner div with bg-{color} transition-all
Live Pulse:  relative w-2 h-2 → absolute animate-ping bg-live/50 + static bg-live
```

---

## 5. Video Recording Presets

```typescript
const VIDEO_PRESETS = {
  tiktok:     { label: 'TikTok/Reels', duration: '15-60s', ratio: '9:16', fps: 30, tip: 'Hook in first 2 seconds' },
  shorts:     { label: 'YouTube Shorts', duration: '< 60s', ratio: '9:16', fps: 30, tip: 'Text overlay, fast cuts' },
  ig_story:   { label: 'IG Story', duration: '15s', ratio: '9:16', fps: 30, tip: 'Stickers and polls' },
  ig_feed:    { label: 'IG/FB Feed', duration: '30-90s', ratio: '4:5', fps: 30, tip: 'Caption hook, carousel' },
  live:       { label: 'Live Stream', duration: '∞', ratio: '9:16', fps: 30, tip: '15+ min optimal' },
  vibe_cam:   { label: 'Vibe Cam', duration: 'Loop', ratio: '16:9', fps: 24, tip: 'Wide angle, ambient' },
} as const;
```

---

## 6. Key Business Logic

### 6.1 Escrow Flow (All Transaction Types)

```
1. Consumer initiates (book/buy/hire)
2. Stripe PaymentIntent created with `capture_method: 'manual'`
3. Funds authorized on consumer's card (not captured yet)
4. Business fulfils (serves meal / ships product / completes work)
5. [Products] Seller uploads photo proof → consumer reviews → approves/disputes
6. [Services] Freelancer uploads before/after → consumer reviews → approves/disputes
7. On approval: Stripe captures payment → transfers to business minus commission
8. On dispute: PJAZZA mediates. If unresolved, payment voided (consumer refunded).
```

### 6.2 Booking Commission Calculation

```typescript
function calculateCommission(amount: number, industry: IndustryType): {
  commission: number;
  netBusiness: number;
  pjazzaCut: number;
} {
  const config = COMMISSION_RATES[industry];
  
  if (amount < config.minTransaction) {
    return { commission: 0, netBusiness: amount, pjazzaCut: 0 };
  }
  
  let commission = amount * config.rate;
  
  if (config.cap && commission > config.cap) {
    commission = config.cap;
  }
  
  return {
    commission,
    netBusiness: amount - commission,
    pjazzaCut: commission,
  };
}
```

### 6.3 Delivery Fee Calculation

```typescript
function calculateDelivery(orderTotal: number, method: 'hotel' | 'home' | 'pickup'): {
  fee: number;
  pjazzaMargin: number;
} {
  if (method === 'pickup') return { fee: 0, pjazzaMargin: 0 };
  if (orderTotal >= DELIVERY.freeThreshold) return { fee: 0, pjazzaMargin: 0 };
  
  const fee = DELIVERY.islandWide; // €5.99
  return {
    fee,
    pjazzaMargin: fee * DELIVERY.pjazzaMargin, // ~€1.80
  };
}
```

### 6.4 Trust Score Aggregation

```typescript
function aggregateTrustScore(business: Business): {
  score: number;
  totalReviews: number;
  sources: TrustSource[];
} {
  const sources: TrustSource[] = [];
  let weightedSum = 0;
  let totalWeight = 0;
  
  if (business.google_rating) {
    sources.push({ name: 'Google', rating: business.google_rating, count: business.google_review_count, color: '#4285F4' });
    weightedSum += business.google_rating * business.google_review_count;
    totalWeight += business.google_review_count;
  }
  if (business.tripadvisor_rating) {
    sources.push({ name: 'TripAdvisor', rating: business.tripadvisor_rating, count: business.tripadvisor_review_count, color: '#00AF87' });
    weightedSum += business.tripadvisor_rating * business.tripadvisor_review_count;
    totalWeight += business.tripadvisor_review_count;
  }
  if (business.pjazza_rating) {
    // PJAZZA reviews weighted 2x (our platform, verified)
    sources.push({ name: 'PJAZZA', rating: business.pjazza_rating, count: business.pjazza_review_count, color: '#E05A3A' });
    weightedSum += business.pjazza_rating * (business.pjazza_review_count * 2);
    totalWeight += (business.pjazza_review_count * 2);
  }
  
  return {
    score: totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0,
    totalReviews: sources.reduce((sum, s) => sum + s.count, 0),
    sources,
  };
}
```

---

## 7. API Routes Needed (Next.js App Router)

```
/api/auth/callback          — Supabase auth callback
/api/businesses             — CRUD for business listings
/api/businesses/[slug]      — Single business
/api/businesses/[slug]/live — Start/stop live stream (LiveKit token)
/api/bookings               — Create booking + Stripe PaymentIntent
/api/bookings/[id]/approve  — Consumer approves → Stripe captures
/api/bookings/[id]/dispute  — Consumer disputes → mediation flow
/api/products               — CRUD for products
/api/services               — CRUD for services
/api/reviews                — Create review (post-booking)
/api/streams                — Create/end stream
/api/upload                 — Signed URL for file upload (Supabase Storage)
/api/stripe/connect         — Stripe Connect onboarding
/api/stripe/webhook         — Stripe webhook handler
/api/video/token            — LiveKit token for video call
```

---

## 8. Third-Party Integrations (V1)

| Service | Purpose | Config Needed |
|---|---|---|
| Supabase | DB + Auth + Realtime + Storage | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Stripe Connect | Payments + Escrow + Payouts | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |
| LiveKit | Streaming + Video Calls | `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `NEXT_PUBLIC_LIVEKIT_URL` |
| Google Fonts | DM Sans typography | CSS import, no key needed |