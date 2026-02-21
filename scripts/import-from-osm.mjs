#!/usr/bin/env node
/**
 * Import Malta businesses from OpenStreetMap (free, no API key)
 * Fetches shops, restaurants, amenities from Overpass API
 * Outputs SQL for Supabase — run and paste into SQL Editor
 *
 * Usage: node scripts/import-from-osm.mjs
 */

const MALTA_BBOX = [35.8, 14.1, 36.1, 14.6]; // south, west, north, east
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const OSM_TO_INDUSTRY = {
  restaurant: 'food', café: 'food', cafe: 'food', bar: 'food', fast_food: 'food',
  supermarket: 'food', bakery: 'food', pharmacy: 'wellness', hospital: 'wellness',
  clothes: 'fashion', fashion: 'fashion', shoes: 'fashion', jewelry: 'fashion',
  beauty: 'beauty', hairdresser: 'beauty',
  electronics: 'electronics', mobile_phone: 'electronics',
  car: 'cars', car_repair: 'cars',
  gift: 'tourism', souvenirs: 'tourism',
  books: 'education', stationery: 'education',
  pet: 'pets',
  hardware: 'home-services', doityourself: 'home-services',
  estate_agent: 'property',
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) || 'business-' + Math.random().toString(36).slice(2, 8);
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const query = `
[out:json][timeout:60];
(
  node["shop"](${MALTA_BBOX.join(',')});
  node["amenity"="restaurant"](${MALTA_BBOX.join(',')});
  node["amenity"="cafe"](${MALTA_BBOX.join(',')});
  node["amenity"="fast_food"](${MALTA_BBOX.join(',')});
  node["amenity"="bar"](${MALTA_BBOX.join(',')});
  node["amenity"="pharmacy"](${MALTA_BBOX.join(',')});
  node["tourism"="museum"](${MALTA_BBOX.join(',')});
);
out body 200;
`;

async function main() {
  console.log('Fetching Malta POIs from OpenStreetMap...');
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query),
  });
  const data = await res.json();
  const elements = data.elements || [];

  const seen = new Set();
  const businesses = [];

  for (const el of elements) {
    const tags = el.tags || {};
    const name = tags.name;
    if (!name || name.length < 2) continue;

    let industry = 'tourism';
    if (tags.shop) industry = OSM_TO_INDUSTRY[tags.shop] || 'fashion';
    else if (tags.amenity) industry = OSM_TO_INDUSTRY[tags.amenity] || 'food';
    else if (tags.tourism) industry = 'tourism';

    const locality = tags['addr:city'] || tags['addr:place'] || tags['addr:suburb'] || 'Malta';
    const key = `${name}-${locality}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const slug = slugify(name) + '-' + slugify(locality).slice(0, 15);
    const id = uuid();
    businesses.push({
      id,
      name: name.replace(/'/g, "''"),
      slug,
      industry,
      locality: locality.replace(/'/g, "''"),
      address: (tags['addr:street'] || tags['addr:housenumber'] ? [tags['addr:housenumber'], tags['addr:street'], locality].filter(Boolean).join(', ') : locality).replace(/'/g, "''"),
    });
  }

  console.log(`Found ${businesses.length} businesses. Generating SQL...`);

  const sql = `
-- OpenStreetMap Malta import — ${businesses.length} businesses
-- Run in Supabase SQL Editor (after 006_malta_retail_directory.sql)

INSERT INTO public.businesses (id, name, slug, industry, description, locality, verified, is_live, live_viewer_count, cover_image_url, address_full)
VALUES
${businesses
  .map(
    (b) =>
      `  ('${b.id}', '${b.name}', '${b.slug}', '${b.industry}', NULL, '${b.locality}', false, false, 0, '/pjazza/images/stores/fashion-boutique.jpg', ${b.address ? `'${b.address}, Malta'` : 'NULL'})`
  )
  .join(',\n')}
ON CONFLICT (id) DO NOTHING;
`;

  console.log('\n--- Copy from here ---\n');
  console.log(sql);
  console.log('\n--- Copy to here ---\n');
  console.log(`Done. Paste the SQL above into Supabase SQL Editor.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
