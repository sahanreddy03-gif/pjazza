/**
 * POST /api/businesses/[id]/import-products
 * Scrape products from business website_url. Owner only.
 */

import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { scrapeProductsFromWebsite } from "@/src/lib/enrichment/product-scraper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: biz } = await supabase
      .from("businesses")
      .select("id, name, website_url")
      .eq("id", id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!biz) return NextResponse.json({ error: "Business not found" }, { status: 404 });
    const url = biz.website_url?.trim();
    if (!url) return NextResponse.json({ error: "Add website URL in Settings first" }, { status: 400 });

    const products = await scrapeProductsFromWebsite(url, biz.name);
    let added = 0;

    for (const p of products.slice(0, 10)) {
      const { error } = await supabase.from("products").insert({
        business_id: id,
        name: p.name.slice(0, 200),
        description: p.description ?? null,
        price: p.price ?? 0,
        image_urls: p.image_url ? [p.image_url] : [],
        is_available: true,
      });
      if (!error) added++;
    }

    return NextResponse.json({ added });
  } catch (e) {
    console.error("[import-products]", e);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
