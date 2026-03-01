/**
 * POST /api/admin/enrich-products
 * Scrape product listings from business website URLs
 * Uses website_url from businesses. Inserts into products table.
 *
 * ?secret=ADMIN_IMPORT_SECRET
 * Body: { business_ids?: string[] }
 */

import { createAdminClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { scrapeProductsFromWebsite } from "@/src/lib/enrichment/product-scraper";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (process.env.ADMIN_IMPORT_SECRET && secret !== process.env.ADMIN_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { business_ids?: string[] } = {};
  try {
    body = await req.json();
  } catch {}

  const supabase = createAdminClient();
  let query = supabase
    .from("businesses")
    .select("id, name, website_url")
    .not("website_url", "is", null);

  if (body.business_ids?.length) {
    query = query.in("id", body.business_ids);
  }

  const { data: businesses, error } = await query.limit(30);
  if (error || !businesses?.length) {
    return NextResponse.json({
      success: false,
      products_added: 0,
      message: "No businesses with website_url",
    });
  }

  let productsAdded = 0;

  for (const b of businesses) {
    const url = b.website_url?.trim();
    if (!url) continue;

    try {
      const products = await scrapeProductsFromWebsite(url, b.name);
      for (const p of products.slice(0, 10)) {
        const { error: insErr } = await supabase.from("products").insert({
          business_id: b.id,
          name: p.name.slice(0, 200),
          description: p.description ?? null,
          price: p.price ?? 0,
          image_urls: p.image_url ? [p.image_url] : [],
          is_available: true,
        });
        if (!insErr) productsAdded++;
      }
    } catch {
      // skip on error
    }
    await new Promise((r) => setTimeout(r, 500)); // be polite
  }

  return NextResponse.json({
    success: true,
    businesses_processed: businesses.length,
    products_added: productsAdded,
  });
}
