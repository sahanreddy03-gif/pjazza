/**
 * POST /api/admin/enrich
 * Enrich businesses with Google Places (photos, ratings, address, phone, website)
 * Enriches all or a subset. Uses GOOGLE_PLACES_API_KEY.
 *
 * ?secret=ADMIN_IMPORT_SECRET
 * Body: { business_ids?: string[] } — optional; omit to enrich all
 */

import { createAdminClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { enrichBusinessWithGooglePlaces } from "@/src/lib/enrichment/google-places";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (process.env.ADMIN_IMPORT_SECRET && secret !== process.env.ADMIN_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_PLACES_API_KEY required. Add to .env.local" },
      { status: 500 }
    );
  }

  let body: { business_ids?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    // empty body ok
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("businesses")
    .select("id, name, slug, locality")
    .order("name");

  if (body.business_ids?.length) {
    query = query.in("id", body.business_ids);
  }

  const { data: businesses, error } = await query.limit(50);
  if (error || !businesses?.length) {
    return NextResponse.json({
      success: false,
      enriched: 0,
      message: "No businesses to enrich",
    });
  }

  let enriched = 0;
  const results: { id: string; slug: string; ok: boolean; error?: string }[] = [];

  for (let i = 0; i < businesses.length; i++) {
    const b = businesses[i];
    try {
      const data = await enrichBusinessWithGooglePlaces(
        b.name,
        b.locality ?? "Malta",
        apiKey
      );

      if (!data) {
        results.push({ id: b.id, slug: b.slug, ok: false, error: "Place not found" });
        continue;
      }

      const { error: upErr } = await supabase
        .from("businesses")
        .update({
          google_rating: data.google_rating ?? null,
          google_review_count: data.google_review_count ?? null,
          cover_image_url: data.cover_image_url ?? null,
          image_urls: data.image_urls ?? null,
          address_full: data.address_full ?? null,
          phone: data.phone ?? null,
          website_url: data.website_url ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", b.id);

      if (upErr) {
        results.push({ id: b.id, slug: b.slug, ok: false, error: upErr.message });
        continue;
      }

      // Insert business_reviews from Google reviews
      if (data.reviews?.length) {
        for (const rev of data.reviews) {
          await supabase.from("business_reviews").insert({
            business_id: b.id,
            platform: "google",
            rating: rev.rating,
            review_text: rev.text,
            author_name: rev.author,
            is_positive: rev.rating >= 4,
          });
        }
      }

      enriched++;
      results.push({ id: b.id, slug: b.slug, ok: true });
    } catch (e) {
      results.push({
        id: b.id,
        slug: b.slug,
        ok: false,
        error: e instanceof Error ? e.message : "Enrichment failed",
      });
    }
    await new Promise((r) => setTimeout(r, 250)); // Rate limit
  }

  return NextResponse.json({
    success: true,
    enriched,
    total: businesses.length,
    results,
  });
}
