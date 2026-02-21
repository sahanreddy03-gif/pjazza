# PJAZZA Data Import — Link to External Data

Make the app appear **big, structured, and data-rich** using free and paid sources.

---

## 1. OpenStreetMap (Free, No API Key)

Import 100+ Malta shops, restaurants, cafes, pharmacies from OpenStreetMap.

### Option A: API route (recommended)

1. Add to `.env.local`:
   ```
   ADMIN_IMPORT_SECRET=your-random-secret
   ```

2. Call the endpoint (with dev server running):
   ```
   GET /api/admin/import-osm?secret=your-random-secret
   ```

3. Businesses are inserted into Supabase. Run again to fetch more; duplicates are skipped.

### Option B: Script → SQL

```bash
npm run import:osm
```

Copy the output SQL and paste into **Supabase SQL Editor**.

---

## 2. Google Places (Enrichment — API Key Required)

Add real photos, ratings, review counts, addresses from Google.

1. Get a [Google Places API key](https://console.cloud.google.com/apis/credentials)
2. Add to `.env.local`:
   ```
   GOOGLE_PLACES_API_KEY=your_key
   ```
3. Run (with dev server running, so `/api/businesses` returns data):
   ```bash
   npm run enrich:google
   ```
4. Copy the generated UPDATE statements into Supabase SQL Editor

---

## 3. Run Migrations First

Before importing, ensure you have run:

- `001_initial_schema.sql`
- `004_business_rich_data.sql` (or `006` which adds missing columns)
- `006_malta_retail_directory.sql` (44 real Malta businesses)

---

## What Each Source Gives You

| Source         | Businesses | Photos | Reviews | Cost        |
|----------------|------------|--------|---------|-------------|
| Migration 006  | 60+        | Placeholder | Curated | Free        |
| OpenStreetMap  | 100+       | No     | No      | Free        |
| Google Places  | Enriches existing | Yes | Yes     | Paid (credits) |

---

## Appearing Big & Structured

- **Stats**: Hero and Final CTA show `{count}+ businesses`, `12 sectors`, `Escrow protected`
- **Retail filter**: Macro categories (Retail vs Experiences) with clear labels
- **Curated reviews**: 2 best + 2 worst per business for quick vibe check
- **Claim flow**: "Find your business" on onboarding — pre-populated listings for pitching
