# PJAZZA — Product Requirements Document

**Version:** 1.0
**Date:** February 2026
**Author:** Sahan (Founder) + Claude (Strategy/Architecture)
**Status:** Pre-production

---

## 1. Product Vision

PJAZZA becomes the default infrastructure through which money moves between buyers and sellers on the island of Malta. Every booking, every purchase, every service hire flows through a layer of live video verification, aggregated trust, and escrow-protected payment. PJAZZA captures a percentage of each transaction.

The long-term play: prove the model on Malta (316 km², captive market), then replicate on Cyprus, Sardinia, Crete, and Balearic Islands — every Mediterranean island with tourism-dependent economies and fragmented local business ecosystems.

---

## 2. Core Problems Solved

### For Consumers

| Problem | How PJAZZA Solves It |
|---|---|
| "I can't tell if this restaurant is good" — reviews are old, fake, or sparse | Multi-platform trust score aggregating Google + TripAdvisor + PJAZZA reviews. Live video shows the actual venue right now. AI sentiment analysis surfaces what people love and what to watch out for. |
| "I don't know what's happening near me" — tourists are blind | Live discovery feed shows businesses streaming within radius. Weather-reactive suggestions. Cruise ship dock alerts. Category browsing across 8 verticals. |
| "I'm afraid of getting scammed" — especially for high-value transactions (property, cars, services) | Escrow-protected payments via Stripe Connect. Money held until buyer approves. Photo-verified purchase flow for products. Before/after verification for services. |
| "I can't see inside before committing" — restaurants, shops, apartments | Atmosphere cameras (GDPR-safe, face-blurred, business-controlled) show real-time venue conditions. Live streams show food being cooked, apartments being walked through, products being made. |
| "I don't know how busy it is" — wasted trips, long waits | Crowd intelligence system combining Google Popular Times + PJAZZA booking data + event calendar + cruise ship schedule + weather data. Shows current capacity percentage, best time to visit, predicted busyness. |
| "I can't get it delivered to my hotel" — tourists can't carry purchases while sightseeing | Same-day delivery via PJAZZA Express (partner with Bolt/local couriers). €5.99 island-wide, FREE over €50. Hotel reception coordination. |
| "I need a plumber but don't know who to trust" | Verified freelancer profiles with escrow payment, response time SLA, live work streaming, before/after photo portfolio, verified ratings from completed jobs. |

### For Businesses

| Problem | How PJAZZA Solves It |
|---|---|
| "Tourists walk past my door" — invisibility | Go live in 10 seconds from phone. Tourists within 500m get notified. Appear in discovery feed with trust score and live badge. |
| "No-shows cost me money" — especially restaurants, salons | Escrow deposit held at booking. Customer committed, business protected. |
| "I lose 20% to Airbnb/booking platforms" — commission pain | PJAZZA commission: 8% for most categories (vs Airbnb's 20%, Booking.com's 15-25%). |
| "I can't prove my work to new customers" — tradespeople, salons | Live work streaming, before/after photo verification, auto-generated portfolio from streams. |
| "I can't sell to tourists who haven't visited yet" — remote buyers for property, yachts, cars | Live video tours with real-time Q&A. Paid private consultations (€25-50/session for real estate). One-to-one video calls for high-value items. |
| "I don't know when to be ready for rush" — no demand prediction | AI demand prediction based on cruise ship schedule, weather forecast, event calendar, historical data. Business gets alerted: "4,500 passengers arriving tomorrow at 7 AM, go live at 9:30 for peak traffic." |

---

## 3. User Types

### 3.1 Consumer Personas

**Tourist (Primary)**
- In Malta for 3-7 days. Smartphone in hand. Needs to make decisions quickly about where to eat, what to do, what to buy.
- May arrive by cruise ship (6-hour window) or flight (multi-day).
- Sensitivity: high trust need, low local knowledge, high willingness to spend.

**Expat (Secondary)**
- Relocated to Malta. Needs services (plumber, electrician, cleaner), property, daily commerce.
- Sensitivity: moderate trust need, growing local knowledge, recurring usage.

**Maltese Local (Tertiary)**
- Born/raised in Malta. Uses PJAZZA for services, crowd checking, and discovering new places.
- Sensitivity: low trust need (knows the market), high price sensitivity, sporadic usage initially.

### 3.2 Consumer Tiers (Personalisation Layer)

| Tier | Name | What Changes |
|---|---|---|
| Premium | "Best of Best" | Shows luxury venues, fine dining, 5-star experiences first. Hides budget options unless searched. |
| Explorer | "Great Value" | Shows quality-focused mid-range options. Balances price with ratings. Default tier. |
| Budget | "Best Deals" | Shows affordable options, happy hours, free events, under-€10 meals. |

Selection happens at first launch. Affects ranking, recommendations, and what information is displayed (e.g., Budget tier shows "€2 pastizzi" prominently; Premium shows "€45/pp tasting menu").

### 3.3 Business User

- Single person operating the business (owner, manager, or designated staff)
- Uses PJAZZA to: go live, respond to bookings, manage incoming video call requests, view earnings, upload atmosphere camera footage
- Needs: simplicity (must be able to go live in 10 seconds), clear earnings tracking, demand prediction

---

## 4. Core Features (Discussed and Coded)

### 4.1 Discovery & Trust

| Feature | Description | Revenue Implication |
|---|---|---|
| **Live Stream Feed** | Horizontal scroll of businesses currently streaming. Shows viewer count, distance, rating, price tier, crowd level, live badge. | Drives bookings (commission per booking). Featured placement: €25/day. |
| **Multi-Platform Trust Score** | Aggregates Google Reviews + TripAdvisor + PJAZZA native reviews into single score. Shows review count per source. | Core trust mechanism. Businesses with higher scores get more bookings. |
| **AI Sentiment Analysis** | Scans all reviews. Outputs: "What people love" (with mention counts) and "Honest heads-up" (with mention counts). | Differentiator. No platform in Malta does this. |
| **Crowd Intelligence** | Real-time capacity percentage per venue. Sources: Google Popular Times, PJAZZA booking data, event calendar, cruise schedule, weather. Shows: current %, best time to visit, predicted busyness, season factor. | Drives off-peak bookings (more transactions overall). |
| **Atmosphere Camera (Vibe Cam)** | GDPR-safe camera showing live venue interior. AI face-blur mandatory. Business-controlled (on/off). No audio. | Pro tier feature (€149/mo). Increases consumer trust → more bookings. |
| **Category Grid** | 12 categories: Dining, Tours, Property, Yachts, Cars, Artisan, Wellness, Nightlife, Services, Retail, Health, Gyms. Each shows live count. | Organises discovery across all verticals. |
| **Tier Selector** | 4 options: Show All, Best of Best, Great Value, Best Deals. Changes ranking and display of all content. | Personalisation increases conversion. |
| **Search + Voice** | Free-text search across all businesses, products, and services. Voice input for tourists. | Reduces friction to discovery. |

### 4.2 Booking & Transactions

| Feature | Description | Revenue Implication |
|---|---|---|
| **3-Tap Booking** | View → Select date/time/guests → Confirm with deposit. Escrow holds deposit via Stripe Connect. | Commission: 8% on dining, 8% on beauty, 8% on tours. |
| **Photo-Verified Purchase** | 5-step flow: Browse → Pay (escrow) → Seller photographs order → Buyer approves → Payment releases. | Commission: 8% on retail. Eliminates disputes. |
| **Escrow Payment (Services)** | Customer pays into escrow. Freelancer completes work + uploads before/after photos. Customer approves. Money releases. | Commission: 10% on freelancer jobs. |
| **Live Property Tours** | Scheduled or on-demand video tour of apartment/property. Can be free (marketing) or paid (€25-50/session for private tour). | Commission: 0.5% referral on signed lease + tour booking fee. |
| **Yacht/Car Live Walkaround** | Business streams live tour of vehicle/vessel. Buyer watches, asks questions, decides. | Yacht: 3% commission. Cars: 1% (capped €200). |
| **Split Bill** | Post-booking, group can split the cost via in-app payment. | Captures more transaction data. Small convenience that drives adoption. |
| **Tipping** | Optional tip button post-experience. Goes directly to staff via Stripe. | 0% commission on tips (goodwill feature). Increases business satisfaction. |
| **Currency Converter** | Shows prices in tourist's home currency alongside EUR. | Reduces decision friction for tourists. |

### 4.3 Video Commerce

| Feature | Description | Revenue Implication |
|---|---|---|
| **Video Call Shopping** | Consumer selects a retail store → video call connects to salesperson → salesperson shows products live on camera → consumer buys in-app → delivery arranged. | Commission: 8% on purchase. Delivery margin: 30% of delivery fee. |
| **Live Shopping Stream** | Business streams products being made/demonstrated. Viewers buy during stream. Products can be tagged/linked. | Commission: 8% per purchase. |
| **Same-Day Hotel Delivery** | PJAZZA Express: partner with Bolt/local couriers. €5.99 island-wide, FREE over €50. Hotel reception coordination for tourists. | Delivery fee: €5.99 (PJAZZA keeps ~€1.80/delivery = 30% margin). |

### 4.4 Business Tools

| Feature | Description |
|---|---|
| **Go Live / Video Record** | Camera interface with platform-optimised presets: TikTok (15-60s, 9:16, 30fps), YouTube Shorts (<60s, 9:16), IG Story (15s, 9:16), IG/FB Feed (30-90s, 4:5), Live Stream (∞, 9:16), Vibe Cam (loop, 16:9, 24fps). Each preset auto-configures duration, aspect ratio, FPS, and shows platform-specific algorithm tips. |
| **Atmosphere Camera Upload** | Connect IP camera (RTSP) or use phone as Vibe Cam. Auto face-blur. Crowd counting. 24/7 live feed to business profile. |
| **Auto-Upload to Socials** | Recorded video auto-exports to TikTok, Reels, Shorts, Stories with correct format per platform. |
| **Smart Clips** | AI auto-cuts best moments from streams (peak viewers, most reactions, purchase highlight). Generates 15-second clips for reuse. |
| **AI Demand Prediction** | Alerts business based on: cruise ship arrivals, weather forecast, event calendar, historical booking patterns. "Go LIVE at 9:30 AM for peak traffic (+40%)." |
| **Incoming Requests Feed** | Unified inbox: bookings, video call requests, shop orders. Shows monetary value per request. Accept/decline buttons. Response time SLA tracking (30-min target). |
| **Earnings Dashboard** | Revenue breakdown: booking income, product sales, PJAZZA commission deducted, net payout. Payout schedule: every Monday via Stripe Connect. |
| **Streaming Streak** | Gamification: consecutive days streamed. Higher streaks = higher search ranking. |
| **PJAZZA Kit** | Physical kit shipped to businesses: phone mount + ring light. Free for Founding Partners. |

### 4.5 Trust & Safety

| Feature | Description |
|---|---|
| **Verified Local Badge** | Business physically verified by PJAZZA team during onboarding. Permanent badge. |
| **EU Trust Certified Badge** | Businesses meeting EU Consumer Protection standards. |
| **GDPR Compliance** | Tourist data auto-deletes 30 days after last Malta activity. Anonymous browsing mode available. On-device AI processing where possible. |
| **Atmosphere Camera DPIA** | Data Protection Impact Assessment required before any camera deployment. Explicit signage. Faces auto-blurred. No audio. Business controls on/off. |
| **Dispute Resolution** | Photo evidence + escrow hold. Buyer can dispute before approving. PJAZZA mediates. |
| **100% Money-Back Guarantee** | First 1,000 bookings platform-wide. PJAZZA absorbs the cost. Marketing/trust-building tool. |

### 4.6 Community & Content

| Feature | Description |
|---|---|
| **Community Boards** | Community-specific spaces: Indian, Muslim, Digital Nomad, British, Filipino, Italian. Member counts. Cultural curators. |
| **PJAZZA Magazine** | Editorial content: sunset spots, street food guides, hidden beaches. Drives organic SEO. |
| **Time Machine** | View venue at different times: Now (live), 1 hour ago, last Sunday, last month. Built from replay archive. |
| **Reverse Marketplace** | Consumer posts request ("seafood, harbour view, under €30/pp, tonight 8pm"). Matching businesses respond with video. |
| **Malta Buddy** | Free 15-minute live orientation matching new arrivals with local volunteers. Volunteers earn PJAZZA credits. |
| **Morning Brief** | Daily push notification at 8 AM: weather + top event + hidden gem suggestion. Max 3 notifications/day. |

### 4.7 Accessibility & Inclusivity

| Feature | Description |
|---|---|
| **Dietary Filters** | Halal Confidence Score (100%/75%/50%), Vegan, Gluten-Free. Toggleable in profile. |
| **Halal Confidence Score** | Nuanced: "Dedicated halal kitchen (100%)" / "Halal options, shared kitchen (75%)" / "Vegetarian-safe, not certified (50%)". |
| **Prayer Time Integration** | Shows nearest mosque, time to next prayer, nearby halal restaurants for iftar during Ramadan. |
| **Wheelchair Access Rating** | Per-venue: step-free access, accessible toilets, sensory-friendly hours. |
| **Multi-Language** | 6 languages: English, Maltese, Italian, French, German, Spanish. Live stream auto-translation via Whisper. |
| **Anonymous Browsing** | Tourist can browse without account. Data not retained. |

---

## 5. Monetisation Logic

### 5.1 Transaction Commissions (Primary Revenue)

| Industry | Rate | Trigger | Avg PJAZZA Cut |
|---|---|---|---|
| Dining | 8% | On bookings over €20 | €3.60/booking |
| Real Estate | 0.5% referral + €25-50/tour | On signed lease or paid private tour | €37.50 avg |
| Yacht Charter | 3% | On charter value | €255/charter |
| Automotive | 1% (capped €200) | On completed sale | €148/sale |
| Freelancer/Services | 10% | On completed + approved job | €4.50/job |
| Retail/Artisan | 8% | On purchase | €3.04/order |
| Beauty/Wellness | 8% | On booking | €5.60/booking |
| Tours/Experiences | 8% | On booking | €4.40/booking |

### 5.2 Delivery Margin

| Type | Customer Price | PJAZZA Margin |
|---|---|---|
| Same-town delivery | €3.99 | ~€1.20 (30%) |
| Island-wide delivery | €5.99 | ~€1.80 (30%) |
| Orders over €50 | FREE | Absorbed (funded by commission) |

### 5.3 Subscriptions (Secondary Revenue)

| Plan | Price | Includes |
|---|---|---|
| Discovery (Free) | €0/mo | Go live 3x/month, basic profile, escrow payments, PJAZZA badge |
| Starter | €49/mo | Unlimited live, analytics, Smart Clips (5/mo), priority search |
| Professional | €149/mo | AI demand prediction, Atmosphere Camera, unlimited Smart Clips, featured placement |
| Enterprise | €299/mo | Multi-user accounts, API access, developer partnerships, dedicated support |

### 5.4 Advertising & Placement

| Type | Price |
|---|---|
| Featured listing | €25/day |
| Promoted in category | €10/day |
| Tourist welcome credit (sponsored) | €5/tourist (sponsor pays) |

### 5.5 Revenue Tracking

All commission is automatically deducted by Stripe Connect before payout. Business sees: gross revenue, PJAZZA fee, net payout on their dashboard. Payouts every Monday. No invoicing required.

---

## 6. Explicit Non-Goals (V1)

These are things we have discussed but are explicitly NOT building in V1:

- **Native iOS/Android app store listing.** PWA-first for tourists. Native app is V2.
- **International expansion.** Malta only. Cyprus is Year 3.
- **PJAZZA Credits / in-app currency.** Discussed but adds regulatory complexity. V2+.
- **Subscription Box ("PJAZZA Select").** Requires logistics infrastructure. V3.
- **Malta Operating System brand play.** Aspirational positioning. Not a V1 feature.
- **Dynamic QR codes at bus stops.** Requires partnership with Malta Public Transport. Phase 2 marketing.
- **AI Trip Planner / multi-day itinerary generator.** Discussed in playbook. Deferred to V2.
- **"Malta in a Box" gift shipping worldwide.** Logistics complexity. V3.
- **Refugee/migrant business spotlight.** Important but requires community partnerships. V2.
- **PJAZZA Academy (business education).** Content marketing, not product. V2.
- **Hotel concierge white-label view.** Discussed but complex integration. V2.
- **Gamified live map (lit-up vs greyed-out businesses).** Cool visual but not core. V2.