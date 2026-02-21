/**
 * Import Malta businesses from OpenStreetMap
 * Fetches shops, restaurants, amenities from Overpass API and inserts into Supabase
 *
 * Protect with secret: GET /api/admin/import-osm?secret=YOUR_SECRET
 * Set ADMIN_IMPORT_SECRET in .env.local
 */

import { createAdminClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MALTA_BBOX = [35.8, 14.1, 36.1, 14.6];
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const OSM_TO_INDUSTRY: Record<string, string> = {
  restaurant: "food", café: "food", cafe: "food", bar: "food", fast_food: "food",
  supermarket: "food", bakery: "food", pharmacy: "wellness", hospital: "wellness",
  clothes: "fashion", fashion: "fashion", shoes: "fashion", jewelry: "fashion",
  beauty: "beauty", hairdresser: "beauty",
  electronics: "electronics", mobile_phone: "electronics",
  car: "cars", car_repair: "cars",
  gift: "tourism", souvenirs: "tourism",
  books: "education", stationery: "education",
  pet: "pets",
  hardware: "home-services", doityourself: "home-services",
  estate_agent: "property",
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "business-" + Math.random().toString(36).slice(2, 8);
}

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (process.env.ADMIN_IMPORT_SECRET && secret !== process.env.ADMIN_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = `
[out:json][timeout:60];
(
  node["shop"](${MALTA_BBOX.join(",")});
  node["amenity"="restaurant"](${MALTA_BBOX.join(",")});
  node["amenity"="cafe"](${MALTA_BBOX.join(",")});
  node["amenity"="fast_food"](${MALTA_BBOX.join(",")});
  node["amenity"="bar"](${MALTA_BBOX.join(",")});
  node["amenity"="pharmacy"](${MALTA_BBOX.join(",")});
  node["tourism"="museum"](${MALTA_BBOX.join(",")});
);
out body 200;
`;

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(query),
    });
    const data = await res.json();
    const elements = data.elements || [];

    const seen = new Set<string>();
    const businesses: { id: string; name: string; slug: string; industry: string; locality: string; address_full: string | null }[] = [];

    for (const el of elements) {
      const tags = el.tags || {};
      const name = tags.name;
      if (!name || name.length < 2) continue;

      let industry = "tourism";
      if (tags.shop) industry = OSM_TO_INDUSTRY[tags.shop] || "fashion";
      else if (tags.amenity) industry = OSM_TO_INDUSTRY[tags.amenity] || "food";
      else if (tags.tourism) industry = "tourism";

      const locality = tags["addr:city"] || tags["addr:place"] || tags["addr:suburb"] || "Malta";
      const key = `${name}-${locality}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const slug = slugify(name) + "-" + slugify(locality).slice(0, 15);
      businesses.push({
        id: uuid(),
        name,
        slug,
        industry,
        locality,
        address_full: tags["addr:street"] || tags["addr:housenumber"]
          ? [tags["addr:housenumber"], tags["addr:street"], locality].filter(Boolean).join(", ") + ", Malta"
          : null,
      });
    }

    const supabase = createAdminClient();
    let inserted = 0;
    for (const b of businesses.slice(0, 100)) {
      const { error } = await supabase.from("businesses").upsert(
        {
          id: b.id,
          name: b.name,
          slug: b.slug,
          industry: b.industry,
          locality: b.locality,
          address_full: b.address_full,
          cover_image_url: "/pjazza/images/stores/fashion-boutique.jpg",
        },
        { onConflict: "slug", ignoreDuplicates: true }
      );
      if (!error) inserted++;
    }

    return NextResponse.json({
      success: true,
      fetched: elements.length,
      businesses: businesses.length,
      inserted,
      message: `Imported ${inserted} new businesses from OpenStreetMap`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Import failed" },
      { status: 500 }
    );
  }
}
