# PJAZZA Data Import & Enrichment

Make the app appear **big, structured, and data-rich** using free and paid sources.  
Auto-scrape and enrich: businesses, products, freelancers, cruise arrivals, social, analytics.

---

## Quick Start

1. Add to `.env.local`:
   ```
   ADMIN_IMPORT_SECRET=your-random-secret
   GOOGLE_PLACES_API_KEY=your_key  # for photos, ratings, address, phone, website
   ```

2. Run migration 013 in Supabase SQL Editor (reviews + photo proof).

3. With dev server running:
   ```
   POST /api/admin/enrich-all?secret=your-random-secret
   ```
   Body: `{}` — runs all enrichment pipelines.

---

## 1. OpenStreetMap (Free, No API Key)

Import 100+ Malta shops, restaurants, cafes, pharmacies.

```
GET /api/admin/import-osm?secret=YOUR_SECRET
```

Or: `npm run import:osm` → copy output SQL into Supabase.

---

## 2. Google Places (Enrichment — API Key)

Add photos, ratings, reviews, address, phone, website.

```
POST /api/admin/enrich?secret=YOUR_SECRET
Body: {}  // enrich all businesses
Body: { "business_ids": ["id1", "id2"] }  // or specific
```

Requires `GOOGLE_PLACES_API_KEY`. Updates `businesses` and inserts into `business_reviews`.

---

## 3. Product Scraping (From Business Websites)

Scrape product listings from business `website_url` (JSON-LD schema, meta tags, common patterns).

```
POST /api/admin/enrich-products?secret=YOUR_SECRET
Body: {}  // all businesses with website_url
Body: { "business_ids": ["id1"] }
```

Inserts into `products` table.

---

## 4. Freelancer / Tradesperson Import

Import freelancers and tradespeople as businesses (industry: freelancer).

```
POST /api/admin/import-freelancers?secret=YOUR_SECRET
Body: {
  "freelancers": [
    { "name": "Mark Borg", "specialty": "Licensed Electrician", "locality": "Birkirkara", "hourly": "€35/hr", "phone": "+356...", "website": "https://..." },
    { "name": "Maria Grech", "specialty": "Maltese Cooking Teacher", "locality": "Mdina", "hourly": "€45/class" }
  ]
}
```

---

## 5. Cruise Arrivals (Valletta Cruise Port)

Scrape cruise ship schedule from Valletta Cruise Port, insert into `cruise_arrivals`.

```
POST /api/admin/enrich-cruise?secret=YOUR_SECRET
```

---

## 6. OpenAI (AI Descriptions)

Generate business descriptions with OpenAI.

```
POST /api/admin/enrich-openai?secret=YOUR_SECRET
Body: {}  // businesses with missing/empty description
Body: { "business_ids": ["id1"] }
```

Requires `OPENAI_API_KEY`.

---

## 7. Cloudflare Stream (Broadcast Video)

Get upload URL for video broadcast.

```
POST /api/admin/cloudflare-stream-upload?secret=YOUR_SECRET
Body: { "filename": "my-video.mp4", "metadata": { "business_id": "..." } }
```

Requires `CLOUDFLARE_STREAM_ACCOUNT_ID`, `CLOUDFLARE_STREAM_API_TOKEN`.

---

## 8. Enrich All (One Call)

Run all pipelines in sequence:

```
POST /api/admin/enrich-all?secret=YOUR_SECRET
Body: { "google": true, "products": true, "cruise": true, "openai": true }  // all default true
```

---

## 9. Social Media (TikTok, Instagram, Meta)

Placeholders for future integration. APIs require developer approval:

- **TikTok**: https://developers.tiktok.com/ — Display API, Login Kit
- **Instagram**: https://developers.facebook.com/docs/instagram-api
- **Meta**: Graph API for Pages, ads, business info

---

## Env Vars Reference

| Key | Purpose | Required For |
|-----|---------|--------------|
| ADMIN_IMPORT_SECRET | Protect admin routes | All admin APIs |
| GOOGLE_PLACES_API_KEY | Photos, ratings, address, phone, website | /api/admin/enrich |
| OPENAI_API_KEY | AI descriptions, concierge | /api/admin/enrich-openai |
| CLOUDFLARE_STREAM_ACCOUNT_ID | Broadcast video | /api/admin/cloudflare-stream-upload |
| CLOUDFLARE_STREAM_API_TOKEN | Cloudflare Stream | /api/admin/cloudflare-stream-upload |
| NEXT_PUBLIC_ABLY_API_KEY | Realtime presence (client) | Ably |
| ABLY_API_KEY | Realtime presence (server) | Ably |
| NEXT_PUBLIC_POSTHOG_KEY | Analytics | PostHogProvider |

---

## What Each Source Gives You

| Source | Data | Cost |
|--------|------|------|
| Migration 006 | 60+ Malta businesses | Free |
| OpenStreetMap | 100+ businesses (name, locality) | Free |
| Google Places | Photos, ratings, address, phone, website | Paid (credits) |
| Product Scraper | Products from business websites | Free |
| Freelancer Import | Tradespeople, freelancers | Free |
| Cruise Scraper | Valletta cruise arrivals | Free |
| OpenAI | AI business descriptions | Paid |
| Cloudflare Stream | Broadcast video HLS | Paid |
| PostHog | Analytics | Free tier |

---

## Run Migrations First

Before importing, run in Supabase SQL Editor:

- `001_initial_schema.sql` … `012_bookings_rls_business_read.sql`
- `013_reviews_and_photo_proof.sql`
