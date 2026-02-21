#!/usr/bin/env node
/**
 * Enrich businesses with Google Places data (photos, ratings, reviews)
 * Requires: GOOGLE_PLACES_API_KEY in .env.local
 *
 * Usage: node scripts/enrich-google-places.mjs
 * Or set env: GOOGLE_PLACES_API_KEY=your_key node scripts/enrich-google-places.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const env = readFileSync(envPath, 'utf8');
    for (const line of env.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  } catch (_) {}
}

loadEnv();
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error('Missing GOOGLE_PLACES_API_KEY. Add to .env.local');
  process.exit(1);
}

// Fetch businesses from your API (or Supabase)
async function getBusinesses() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/businesses`);
  return res.json();
}

async function searchPlace(name, locality) {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(name + ' ' + locality + ' Malta')}&inputtype=textquery&fields=place_id,name,rating,user_ratings_total,photos,formatted_address&key=${API_KEY}`;
  const res = await fetch(url);
  return res.json();
}

async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,photos,reviews,formatted_address,formatted_phone_number,website&key=${API_KEY}`;
  const res = await fetch(url);
  return res.json();
}

async function main() {
  const businesses = await getBusinesses();
  console.log(`Found ${businesses.length} businesses. Enriching with Google Places...`);
  console.log('(Run with dev server or production URL for /api/businesses)\n');

  const updates = [];
  for (let i = 0; i < Math.min(businesses.length, 20); i++) {
    const b = businesses[i];
    const search = await searchPlace(b.name, b.locality || '');
    const cand = search.candidates?.[0];
    if (!cand?.place_id) continue;

    const details = await getPlaceDetails(cand.place_id);
    const result = details.result;
    if (!result) continue;

    const photoRef = result.photos?.[0]?.photo_reference;
    const photoUrl = photoRef ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}` : null;

    updates.push({
      id: b.id,
      slug: b.slug,
      google_rating: result.rating,
      google_review_count: result.user_ratings_total,
      cover_image_url: photoUrl,
      address_full: result.formatted_address,
      phone: result.formatted_phone_number,
      website_url: result.website,
    });
    await new Promise((r) => setTimeout(r, 200)); // Rate limit
  }

  console.log('Sample UPDATE statements (run in Supabase):\n');
  for (const u of updates.slice(0, 5)) {
    console.log(`-- ${u.slug}`);
    console.log(`UPDATE public.businesses SET google_rating = ${u.google_rating}, google_review_count = ${u.google_review_count || 0}, address_full = '${(u.address_full || '').replace(/'/g, "''")}', phone = ${u.phone ? `'${u.phone.replace(/'/g, "''")}'` : 'NULL'}, website_url = ${u.website_url ? `'${u.website_url.replace(/'/g, "''")}'` : 'NULL'}, cover_image_url = ${u.cover_image_url ? `'${u.cover_image_url}'` : 'NULL'} WHERE id = '${u.id}';`);
    console.log('');
  }
  console.log(`... and ${updates.length - 5} more. For full automation, use Supabase + server-side script.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
