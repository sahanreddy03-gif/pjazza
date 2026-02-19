# PJAZZA — V1 Scoping Document

**Version:** 1.0
**Date:** February 2026
**Purpose:** Define exactly what ships in V1, what doesn't, and when.

---

## 1. What Is Included in V1

V1 is a PWA (Progressive Web App) deployed on Vercel that allows:
- Consumers to discover, watch, book, buy, and hire across Malta
- Businesses to go live, accept bookings, receive payments, and track earnings
- PJAZZA to collect commission on every transaction via Stripe Connect

### 1.1 Consumer Features — V1

| Feature | Included | Notes |
|---|---|---|
| Splash screen with Consumer/Business fork | ✅ | First interaction. Determines UI mode. |
| Live stream discovery feed | ✅ | Horizontal scroll. Shows: biz name, category, location, distance, viewers, rating, price, crowd %, live badge. |
| Category grid (8 primary) | ✅ | Dining, Tours, Property, Yachts, Cars, Shop, Services, Wellness. Live count per category. |
| Tier selector (All / Luxury / Value / Deals) | ✅ | Stored in local state. Affects ranking of results. |
| Search (text) | ✅ | Free-text across businesses, products, services. |
| Voice search | ❌ V2 | Requires speech-to-text integration. |
| Business detail page | ✅ | Trust score (multi-platform), AI sentiment, vibe info, crowd %, price, directions. |
| Multi-platform trust score | ✅ | Aggregates Google + TripAdvisor + PJAZZA reviews. Display only — scraping implementation TBD. |
| Crowd intelligence display | ✅ | Current % + colour coding + "book ahead" / "walk in" label. Prediction ("best time") is static in V1, AI-driven in V2. |
| Atmosphere camera preview | ✅ | Static placeholder in V1. Live feed requires camera hardware rollout (Phase 2). |
| Booking flow (3-tap) | ✅ | Select date/time/guests → Confirm → Escrow deposit via Stripe. |
| Photo-verified purchase flow | ✅ | 5-step: Browse → Pay (escrow) → Photo proof → Approve → Deliver. Full flow. |
| Escrow payment for services | ✅ | Book → Pay (hold) → Work done → Approve → Release. Via Stripe Connect. |
| Video call shopping | ✅ | Consumer initiates video call to shop. Salesperson answers on their device. WebRTC via LiveKit. |
| Live shopping (buy during stream) | ✅ | Products linked to stream. Tap to buy. Escrow checkout. |
| Delivery options display | ✅ | Shows: Hotel (FREE >€50 / €5.99), Home (€5.99), Pickup (FREE). Actual delivery dispatching is manual in V1 (business arranges). |
| Freelancer/service listing | ✅ | Name, skill, rating, jobs completed, response time, availability, price, verified badge. |
| Freelancer detail + escrow flow | ✅ | 4-step protection flow. Before/after photo upload by freelancer. |
| Community boards | ✅ | Static listings: Indian, Muslim, Digital Nomad, British. Link to external groups (WhatsApp/Telegram) in V1. Full in-app community is V2. |
| PJAZZA Magazine | ✅ | Static editorial content. Manually published articles. CMS integration is V2. |
| Time Machine | ❌ V2 | Requires replay archive infrastructure. |
| Reverse Marketplace | ❌ V2 | Consumer posting + business matching requires notification system + business app. |
| Malta Buddy | ❌ V2 | Requires matching system + volunteer network. |
| Morning Brief notifications | ❌ V2 | Requires push notification infrastructure. |
| Currency converter | ✅ | Display-only conversion using static rates (updated daily). |
| Split bill | ❌ V2 | Requires multi-party payment flow. |
| Tipping | ❌ V2 | Requires separate Stripe transfer to staff. |
| Dietary/accessibility filters | ✅ | Toggles in profile: Halal, Vegan, Gluten-Free, Wheelchair. Filters search results. |
| Multi-language UI | ✅ | English default. Maltese labels where applicable. Full 6-language i18n is V2. |
| Live stream auto-translation | ❌ V2 | Requires Whisper real-time integration. |
| Anonymous browsing | ✅ | Browse without account. Account required for transactions. |

### 1.2 Business Features — V1

| Feature | Included | Notes |
|---|---|---|
| Industry selection onboarding | ✅ | Business selects industry. Dashboard customises accordingly. |
| Go live (stream from phone) | ✅ | WebRTC via LiveKit. Camera + microphone. Basic stream with viewer count. |
| Video recording with platform presets | ✅ | 6 presets: TikTok, YouTube Shorts, IG Story, IG/FB Feed, Live Stream, Vibe Cam. Auto-configures aspect ratio, duration, FPS. |
| Auto-upload to socials | ❌ V2 | Requires API integration with TikTok/Meta/YouTube. V1 exports file for manual upload. |
| Atmosphere camera upload | ❌ V2 | Requires RTSP integration + face-blur pipeline. V1 shows placeholder. |
| Smart Clips (AI auto-cut) | ❌ V2 | Requires video processing pipeline. V1 shows concept in UI. |
| AI Demand Prediction | ❌ V2 | Requires data pipeline (cruise schedule API, weather API, booking history). V1 shows static mock data. |
| Incoming requests feed | ✅ | Bookings and video call requests appear in feed. Accept/decline. |
| Earnings dashboard | ✅ | Revenue, PJAZZA fee, net payout. Data from Stripe Connect. |
| Subscription plan selection | ✅ | Free / Starter (€49) / Pro (€149). Stripe subscription billing. |
| Response time SLA display | ✅ | Calculated from request timestamps. Displayed to business and consumers. |
| Streaming streak counter | ✅ | Frontend counter based on stream history. |
| QR code for PJAZZA Pay (in-venue) | ❌ V2 | Requires QR generation + walk-in payment flow. |

### 1.3 Platform Infrastructure — V1

| Component | Included | Notes |
|---|---|---|
| User auth (consumer + business) | ✅ | Supabase Auth. Email + Google + Apple sign-in. |
| Business profiles (CRUD) | ✅ | Create, edit, manage business listing. |
| Product/service listings (CRUD) | ✅ | Businesses add products (retail) or services (freelancer) with price, description, photos. |
| Booking system | ✅ | Date/time/guests. Stored in Supabase. Notifications to business. |
| Stripe Connect integration | ✅ | Onboarding flow for businesses. Commission split. Manual payouts (escrow). |
| LiveKit video infrastructure | ✅ | Live streaming (1-to-many) + video calls (1-to-1). |
| File upload (photos, video) | ✅ | Supabase Storage or Cloudflare R2. For profile photos, product images, before/after verification photos. |
| Admin dashboard | ❌ V2 | V1 uses Supabase dashboard + Stripe dashboard directly. |
| Automated delivery dispatch | ❌ V2 | V1: business arranges delivery. PJAZZA provides delivery partner contact info. |
| Review system (native) | ✅ | Post-transaction review. Star rating + text. |
| Review aggregation (Google/TripAdvisor) | ❌ V2 | Requires scraping or API integration. V1 shows PJAZZA-native reviews only. Manual data entry for demo. |

---

## 2. What Is Excluded from V1

| Feature | Reason | Target Phase |
|---|---|---|
| Native mobile app (App Store / Play Store) | PWA-first reduces friction for tourists. Native for business users in V2. | V2 (Month 4-6) |
| Review aggregation from Google/TripAdvisor | Scraping is legally grey. API access requires partnership. | V2 |
| AI-powered features (demand prediction, smart clips, auto-translation) | Requires data pipeline and processing infrastructure. UI shows concept. | V2 |
| Atmosphere camera (live feed) | Requires hardware, DPIA, face-blur pipeline. | V2 (Pro tier) |
| Auto-upload to social platforms | Requires API integration with TikTok/Meta/YouTube. | V2 |
| Push notifications (Morning Brief, alerts) | Requires notification service setup. | V2 |
| PJAZZA Credits / in-app currency | Regulatory complexity (e-money license risk). | V3+ |
| International expansion (Cyprus, Sardinia) | Prove model on Malta first. | Year 3+ |
| Automated delivery dispatch | Requires logistics partner integration (Bolt API). | V2 |
| Time Machine (replay archive) | Requires video storage + indexing infrastructure. | V2 |
| Reverse Marketplace | Requires matching algorithm + notification system. | V2 |
| Admin dashboard | Use Supabase + Stripe dashboards directly. | V2 |
| Hotel concierge white-label | Requires partnership + custom branding. | V3 |
| Subscription Box / gift shipping | Logistics infrastructure needed. | V3 |

---

## 3. Phased Rollout

### Phase 1: Foundation (Weeks 1-8) — "Get 50 Businesses Live"

**Goal:** Working PWA with core consumer discovery + business streaming + booking + payment.

**Build (Weeks 1-6):**
- Auth (Supabase)
- Business profile CRUD
- Product/service listing CRUD
- Live streaming (LiveKit)
- Video calling (LiveKit, 1-to-1)
- Booking system
- Stripe Connect: business onboarding, escrow holds, commission splits, payouts
- Consumer discovery feed (categories, search, live stream cards)
- Business detail page (trust score display, booking button, crowd level)
- Photo-verified purchase flow
- Escrow flow for services
- Earnings dashboard for businesses
- Responsive PWA (installable on phone home screen)

**Launch (Weeks 6-8):**
- Deploy to Vercel (pjazza.app)
- Sahan physically visits 50 businesses in Valletta, Sliema, St Julian's
- Produce first 10 live streams (PJAZZA team films for the business)
- Collect 10-15 Letters of Intent from businesses
- Apply to Malta Enterprise grant (up to €200K)

**Metric:** 50 businesses listed. 10+ streaming. First 5 transactions through escrow.

### Phase 2: Traction (Months 3-6) — "First €10K in GMV"

**Build:**
- Native app (React Native / Expo) for business users
- Review aggregation (Google Places API or manual seeding)
- Push notifications (booking confirmations, Morning Brief)
- Atmosphere Camera pilot (10 founding partner venues, DPIA completed)
- AI Smart Clips (video processing pipeline)
- Auto-social-export (TikTok API, Meta API)
- Delivery partner integration (Bolt Delivery API)
- Community boards (in-app, not just links)
- Time Machine (replay archive)
- Reverse Marketplace (consumer posting)

**Launch:**
- QR codes in 20+ hotel lobbies
- Cruise terminal flyer distribution
- Partnership with 3-5 Airbnb hosts (welcome guide inclusion)
- First paid subscription conversions (Starter and Pro tiers)

**Metric:** 200 businesses. 5,000 MAU. €10K GMV through platform. First Pro subscriber.

### Phase 3: Scale (Months 7-12) — "Break Even"

**Build:**
- AI demand prediction (cruise API, weather API, event calendar)
- Live stream auto-translation (Whisper)
- PJAZZA Pay QR (in-venue walk-in capture)
- Admin dashboard (internal ops)
- Advanced analytics (PostHog funnels)
- Halal Confidence Score (verified with business documentation)
- Malta Buddy matching system
- Multi-language UI (6 languages)

**Launch:**
- Malta Enterprise grant disbursement
- 500+ businesses
- Island-wide coverage (not just Sliema/Valletta corridor)
- Gozo expansion
- First tourism board conversations

**Metric:** 800 businesses. 60,000 MAU. €666K annualised revenue. Break-even Month 10-12.

### Phase 4: Expand (Year 2-3) — "Prove Replicability"

- Cyprus market entry (Year 3)
- Sardinia market research (Year 3-4)
- PJAZZA Credits launch (after legal clearance)
- Hotel white-label partnerships
- B2B data products (anonymised tourism data for Malta Tourism Authority)
- Subscription Box / gift shipping
- Exit conversations begin (target: Booking.com, TripAdvisor, or Mediterranean PE fund)

---

## 4. Technical Constraints

| Constraint | Impact | Mitigation |
|---|---|---|
| **Solo founder (technical + business)** | Can't build everything simultaneously. Must sequence ruthlessly. | Use Cursor AI for code generation. Supabase eliminates backend management. Focus on PWA before native. |
| **€0-50/month budget initially** | No paid infrastructure until revenue or grant funding. | Supabase free tier (500MB DB, 1GB storage, 50K MAU). Vercel free tier (100GB bandwidth). LiveKit free tier (limited). |
| **No App Store presence in V1** | Tourists must access via web link or QR code. No organic App Store discovery. | PWA is installable to home screen. Distribute via QR codes in hotels, restaurants, and at cruise terminal. |
| **Stripe Connect is not true escrow** | Stripe holds funds in connected account but PJAZZA doesn't technically "hold" money. Avoids MFSA licensing. | Use Stripe Connect "manual payouts" mode. Funds captured immediately, transferred to business only on trigger (approval). Legally: marketplace facilitating payments, not a payment institution. |
| **GDPR (Atmosphere Camera)** | Cannot deploy cameras without DPIA, explicit consent signage, mandatory face-blur, business opt-in. | V1: placeholder UI only. V2: full DPIA process before any camera goes live. |
| **Review aggregation** | Scraping Google/TripAdvisor violates TOS. Official APIs have limitations. | V1: PJAZZA-native reviews only. V2: Google Places API (limited data). Manual data seeding for launch demo. |
| **Malta is small** | 540K population. Finite number of businesses. Ceiling on growth without expansion. | Feature this as advantage: total addressable market is contained and conquerable. 800 businesses = significant market share. Expansion to other islands is the growth story. |
| **Cruise ship data** | Need real-time cruise ship schedule for demand prediction. | V1: manually maintain schedule (publicly available from Valletta Cruise Port website). V2: automated scraping or API. |
| **LiveKit concurrent streams** | Free tier supports limited concurrent connections. | V1: 10-20 concurrent streams sufficient. Scale with funding. LiveKit Cloud pricing: $0.004/participant-minute. |

---

## 5. Definition of Done

### V1 is done when:

**Infrastructure:**
- [ ] PWA deployed to pjazza.app on Vercel
- [ ] Supabase project live with production schema
- [ ] Stripe Connect live (not test mode) with Malta business onboarding
- [ ] LiveKit room creation + streaming functional
- [ ] SSL, domain, DNS configured

**Consumer:**
- [ ] A tourist can open pjazza.app on their phone, browse businesses, tap a live stream, watch it, and book a table — with escrow deposit captured
- [ ] A tourist can browse products, buy one, see photo verification, approve, and have payment released to seller
- [ ] A tourist can find a plumber, book them, pay into escrow, and approve after seeing before/after photos
- [ ] A tourist can video-call a shop and buy a product shown to them live
- [ ] Crowd intelligence data displays for at least 10 businesses
- [ ] Search returns relevant results across all categories

**Business:**
- [ ] A restaurant owner can sign up, create a profile, go live, and receive a booking with payment
- [ ] A freelancer can sign up, list their services, accept a job, upload before/after photos, and get paid
- [ ] A shop can sign up, list products, accept a video call, fulfil an order, upload photo proof, and get paid
- [ ] Earnings dashboard shows accurate revenue, fees, and net payout
- [ ] Video recording works with at least 3 platform presets (TikTok, IG Story, Live Stream)

**Business Operations:**
- [ ] 50 businesses listed on the platform
- [ ] 10 businesses have completed at least 1 live stream
- [ ] 5 transactions have flowed through Stripe Connect (escrow → approval → payout)
- [ ] PJAZZA has collected commission on at least 3 transactions

**Legal:**
- [ ] Malta Ltd company registered (or in process)
- [ ] Privacy Policy and Terms of Service published
- [ ] Stripe Connect operating as marketplace (not payment institution)
- [ ] No camera deployed without completed DPIA

---

## 6. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Nobody downloads/visits | HIGH | CRITICAL | PWA = no download. QR codes in hotels = physical distribution. First 50 businesses created BY Sahan. |
| Businesses won't stream | HIGH | HIGH | PJAZZA team produces first 10 streams for them. Free PJAZZA Kit. Founding Partner status. |
| Cold start (no content, no viewers) | HIGH | HIGH | Malta gets 3.8M NEW tourists/year. Sahan creates initial content library. Replay archive provides content even when nobody is live. |
| Stripe Connect regulatory issue | LOW | HIGH | Operating as marketplace, not payment institution. Stripe Connect is designed for this. Confirmed by Stripe's own marketplace documentation. |
| Facebook/Meta copies the model | LOW | LOW | Facebook serves 3B users. They will not build Malta-specific features (festa integration, Maltese language, local delivery, cruise ship alerts). PJAZZA wins on local specificity. |
| Technical failure during live stream | MEDIUM | MEDIUM | LiveKit has built-in reconnection. HLS fallback for high-latency connections. Replays auto-save. |