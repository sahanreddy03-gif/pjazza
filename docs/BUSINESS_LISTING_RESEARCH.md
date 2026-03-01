# Business Listing Requirements — Research & Sector Breakdown

**Purpose:** What does a business need to list on PJAZZA? What varies by sector? What’s automated vs manual? What can we pull from websites and socials? Where do they see their profile? Does it update?

---

## 0. Onboarding Flow (Logic)

**What happens when you enter name and press Create:**

1. **Create** — POST /api/businesses with `{ name, industry, locality }` → inserts row in `businesses`, ensures profile exists
2. **Redirect** → `/pjazza/business/settings?new=1` (add details immediately)
3. **Settings** — Add description, address, phone, website, **cover photo URL**, price tier, dietary, wheelchair → PATCH /api/businesses/[id]
4. **Save** → Redirect to `/pjazza/business/dashboard`
5. **Dashboard** — "Complete setup" card: 1) Add details & cover photo → Settings, 2) Add products → Products, 3) Upload video → Stream
6. **Products** — Add products (name, description, price) → POST /api/products
7. **Stream** — Upload video or go live → /pjazza/business/stream, /pjazza/business/live

**Why basic details?** Name + industry + locality are the minimum for a discoverable listing (slug, category, location). Description, photo, products, and videos are added in Settings, Products, and Stream.

---

## 1. Where Businesses See Their Profile

| Where | Who | When |
|-------|-----|------|
| **Dashboard** | Owner (logged in) | `/pjazza/business/dashboard` — stats, bookings, go live, products, settings |
| **Store page (public)** | Anyone | `/pjazza/live-shop/[slug]` — public page for consumers |
| **Discover** | Anyone | `/pjazza/discover` — appears in browse / search |
| **Live-shop browse** | Anyone | `/pjazza/live-shop` — category grid |
| **Search results** | Anyone | `/search?q=...` — text search |
| **Profile / My businesses** | Owner (logged in) | Not a separate page — dashboard is the “profile” for owners |

**Does it update in the app?** Yes — when the owner edits Settings or Products, the DB row updates. Consumers see the updated store page immediately. No external sync unless you build it (e.g. Google Places, website scrape).

---

## 2. Sector-by-Sector Listing Requirements (Research)

### 2.1 Food & Dining

| Required | Optional | Notes |
|----------|----------|-------|
| Name, locality | Description, address, phone, website | Menu often external (link) |
| Price tier (€, €€, €€€) | Dietary (Halal, Vegan, Gluten-Free), wheelchair | Malta rental listings: €600pcm etc |
| Cover / logo | Gallery, opening hours | High-res photos matter |
| Products (dishes/specials) | Offers, live specials | Per-item price |

- **Pricing:** Per person, per dish, “from €X”.
- **Services:** Table booking, delivery, takeaway.
- **Sources:** Website, Google, TripAdvisor, Facebook (menu, hours, reviews).

---

### 2.2 Real Estate

| Required | Optional | Notes |
|----------|----------|-------|
| Name (agency or property) | Description, address | Malta practice: €X pcm or sale price |
| Property type (apt, villa, townhouse) | Bedrooms, bathrooms, sqm | |
| Price (rent/sale) | Deposit, min term, furnished | |
| Location / locality | Amenities (pool, lift, parking) | |
| Photos (min 1 per room + exterior) | Floor plans, virtual tours | Quality photos essential |
| Legitimacy / proof of listing | Contact details | JamesEdition-style verification |

- **Pricing:** Monthly rent (€/pcm) or sale price; deposit; letting term.
- **Services:** Viewing booking, video tour, virtual walkthrough.
- **Sources:** Property portal feeds, agency website, manual entry.
- **Compliance:** Accurate info, no discrimination; some platforms require proof of right to list.

---

### 2.3 Yachts & Charters

| Required | Optional | Notes |
|----------|----------|-------|
| Boat name | Manufacturer, year | Sailo / YachtWorld-style fields |
| Type (sail, catamaran, motor) | Length, capacity | |
| Base rate (per day/week) | Fuel, crew, APA | Often 30–55% on top of base |
| Location / marina | Amenities, water toys | |
| Photos | Specs, crew info | High-quality shots critical |
| Licensing / insurance | Skipper cert | Legality and safety |

- **Pricing:** Weekly charter; APA, fuel, VAT, crew; seasonal changes.
- **Services:** Charter booking, crew availability, itinerary.
- **Sources:** Broker website, Boatbookings / YachtWorld style listings.

---

### 2.4 Cars & Auto

| Required | Optional | Notes |
|----------|----------|-------|
| Make, model | VIN (if selling) | eBay Motors / Google Vehicle style |
| Year, mileage | Condition, body style | |
| Price | Engine, options | |
| Photos | Payment / deposit terms | Multiple angles |
| Listing format | Pickup / delivery | Fixed-price vs auction |

- **Pricing:** Single sale price; deposit; payment method.
- **Services:** Viewing, test drive, delivery.
- **Sources:** Dealer site, Google Vehicle Listings, VIN lookup APIs.

---

### 2.5 Freelancers (Services)

| Required | Optional | Notes |
|----------|----------|-------|
| Name / business name | Title, tagline | Upwork / Fiverr style |
| Skills / services | Languages, tools | |
| Rate (hourly/project) | Availability | Clear pricing |
| Portfolio (samples) | Reviews, certifications | Original work only |
| Profile photo | Identity verification | Clear headshot |

- **Pricing:** Hourly or per project; transparent rates; platform fee awareness.
- **Services:** Scope, revisions, turnaround.
- **Sources:** LinkedIn, personal site, Upwork/Fiverr export (with care for ToS).

---

### 2.6 Retail / Fashion / Electronics

| Required | Optional | Notes |
|----------|----------|-------|
| Name, locality | Description | |
| Products (name, price, image) | Gallery, brand | |
| Cover / logo | Categories | |
| Price tier | Stock, variants | |

- **Pricing:** Per product; price tier (€, €€, €€€).
- **Sources:** Shopify/WooCommerce, website scrape, manual CSV.

---

### 2.7 Tourism / Tours

| Required | Optional | Notes |
|----------|----------|-------|
| Tour name | Description | |
| Duration, itinerary | Photos, reviews | |
| Price per person | Group size, inclusions | |
| Location / departure | Availability | |

- **Pricing:** Per person; group discounts.
- **Sources:** Viator/GetYourGuide style; operator website.

---

### 2.8 Home Services / Wellness / Beauty

| Required | Optional | Notes |
|----------|----------|-------|
| Name, service type | Description | |
| Rate (hourly / visit) | Availability | |
| Locality | Portfolio, before/after | |

- **Pricing:** Per hour or per job; packages.
- **Sources:** Manual, Facebook, Google.

---

## 3. Data Business Provides vs What We Can Auto-Fetch

### 3.1 Manual (Business Fills In)

| Data | Who | Where |
|------|-----|-------|
| Name, industry, locality | Owner | Onboard form |
| Description | Owner | Settings |
| Address, phone, website | Owner | Settings |
| Cover, logo, gallery | Owner | Upload (no UI yet) |
| Products (name, price, image) | Owner | Manage products |
| Prices, services, offers | Owner | Products / settings |
| Login / password | No — use Supabase Auth | Never ask for external logins |

### 3.2 Automated / External Sources

| Source | What We Can Get | How |
|--------|-----------------|-----|
| **Google Places API** | Name, address, phone, website, hours, photos, ratings, reviews | Official API (limited) or Apify/Openmart |
| **Business website** | Meta tags, structured data, contact | Scrape / schema.org |
| **Facebook / Instagram** | Name, bio, photos, opening hours | Meta Graph API (app approval) |
| **TripAdvisor** | Reviews, ratings | Scraping (ToS risk) |
| **Property feeds** | Malta property data | Darscover / agency feeds (if available) |
| **VIN APIs** | Car specs from VIN | Third-party APIs |

### 3.3 Enrichment Flow (What PJAZZA Has)

- `POST /api/admin/enrich` — Google Places–style enrichment.
- Admin scripts can import from OSM, CSV, etc.
- No automatic sync from website or socials yet.

---

## 4. Onboarding: What’s Automated vs Manual

| Step | Automated? | Manual? | Notes |
|------|------------|---------|-------|
| Create profile | No | Yes | Name, industry, locality on form |
| Pull from Google | Partial | — | Enrich API if we have address/name |
| Add description | No | Yes | Settings |
| Add photos | No | Yes | Upload UI missing |
| Add products | No | Yes | Manage products |
| Set prices | No | Yes | Per product or price tier |
| Connect Stripe | No | Yes | OAuth flow |
| Verify business | No | Yes | Admin or manual flag |
| Pull from website | No | V2 | Scrape / schema.org |
| Sync from social | No | V2 | Meta/Instagram API |

---

## 5. Checklist: Minimum vs Full Listing

### Minimum (Current Onboard)

- Business name (min 2 chars)
- Industry
- Locality (default Malta)

### Full Listing (What Sector Leaders Expect)

| Field | Food | Property | Yachts | Cars | Freelancer |
|-------|------|----------|--------|------|------------|
| Name | ✅ | ✅ | ✅ | ✅ | ✅ |
| Description | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cover/logo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gallery | ✅ | ✅ | ✅ | ✅ | Portfolio |
| Address | ✅ | ✅ | Marina | Dealer | Optional |
| Phone | ✅ | ✅ | ✅ | ✅ | ✅ |
| Website | ✅ | ✅ | ✅ | ✅ | ✅ |
| Price tier | ✅ | ✅ | ✅ | ✅ | ✅ |
| Products | Menu | Listings | Charter packages | Cars | Services |
| Price per item | ✅ | €/pcm or sale | Per week | Per car | Per hour/job |
| Dietary/access | ✅ | ✅ | — | — | — |
| Licensing/proof | — | ✅ | ✅ | VIN | — |
| Social links | Optional | Optional | Optional | Optional | Optional |

---

## 6. Where Can Business See Their Profile?

| Context | URL | Auth? | Updates? |
|---------|-----|-------|----------|
| Dashboard | `/pjazza/business/dashboard` | Yes | Real-time from DB |
| Settings | `/pjazza/business/settings` | Yes | Save → DB → store page |
| Public store | `/pjazza/live-shop/[slug]` | No | Yes — edits reflect immediately |
| Discover | `/pjazza/discover` | No | Yes |
| Search | `/search?q=...` | No | Yes |

**Does it update in the app?** Yes. Edits in Settings or Products update the DB; consumers see the new data on next load. No external sync (Google, website, social) unless you add it.

---

## 7. Open Questions (The “Million Details”)

1. **Verification** — Do we require ID, VAT, business reg before listing? Or trust-first?
2. **Login details** — Never. Use Supabase Auth only. No Facebook/Google business login for data pull.
3. **Website URL** — Use for enrichment (scrape/schema) or manual link only?
4. **Social links** — Display only vs pull posts/photos (Meta API needs approval).
5. **Price format** — Per sector: €/pp, €/pcm, €/week, €/hour, sale price?
6. **Products vs services** — Unified model or separate (retail vs freelancer)?
7. **Images** — Cover, logo, gallery. Required or optional? Max count/size?
8. **Video** — Live stream vs uploaded. Same or different flows?
9. **Offers** — Discounts, seasonal. New field or product-level?
10. **Opening hours** — Manual vs Google sync?
11. **Reviews** — Scrape Google/TripAdvisor or PJAZZA-only?
12. **Auto-enrich** — Run on create? On schedule? Manual trigger?
13. **Claim flow** — Pre-seeded businesses. How to match owner to listing?
14. **Multi-location** — One business, many locations. New model?
15. **Localization** — Maltese/English. Per field or full i18n?

---

## 8. Summary

- **Where profile appears:** Dashboard (owner), store page (public), discover, search.
- **Updates:** Instant in-app when owner edits; no external sync unless built.
- **By sector:** Food, property, yachts, cars, freelancers each need different fields and pricing models.
- **Automation:** Today mostly manual; Google Places and website enrichment possible; social sync is V2.
- **Never collect:** External login credentials; only use Supabase Auth.
- **Next steps:** Decide minimum vs full listing per sector, add image upload, and design enrichment triggers.
