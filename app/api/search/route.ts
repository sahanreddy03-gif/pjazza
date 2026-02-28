/**
 * GET /api/search?q=...
 * Full-text search across all sectors, verticals, and branches:
 * - businesses (name, description, locality, industry, tags, dietary_tags)
 * - products (name, description)
 * - streams (title, description — replays)
 * - categories (by label — returns matching businesses)
 */

import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES } from "@/src/config/categories";

const SECTOR_LABELS: Record<string, string> = {
  dining: "Dining",
  tours: "Tours",
  realestate: "Property",
  yacht: "Yachts",
  cars: "Cars",
  retail: "Shop",
  freelancer: "Services",
  beauty: "Wellness",
  food: "Food & Dining",
  property: "Property",
  yachts: "Yachts & Marine",
  "home-services": "Home Services",
  wellness: "Wellness",
  fashion: "Fashion & Retail",
  electronics: "Electronics",
  tourism: "Tourism",
  education: "Education",
  pets: "Pets & Animals",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

    if (!q || q.length < 2) {
      return NextResponse.json({
        businesses: [],
        products: [],
        streams: [],
        categories: [],
      });
    }

    const supabase = await createClient();
    const term = `%${q.replace(/,/g, " ")}%`;

    // 1. Businesses — name, description, locality, industry
    const { data: businesses } = await supabase
      .from("businesses")
      .select("id, name, slug, industry, locality, description, cover_image_url, is_live, live_viewer_count, tags, dietary_tags")
      .or(`name.ilike.${term},description.ilike.${term},locality.ilike.${term},industry.ilike.${term}`)
      .limit(limit);

    const uniqueBiz = businesses || [];

    // 2. Products — name, description; join business
    const { data: products } = await supabase
      .from("products")
      .select("id, name, description, price, image_urls, business_id")
      .or(`name.ilike.${term},description.ilike.${term}`)
      .eq("is_available", true)
      .limit(limit);

    const productBizIds = [...new Set((products || []).map((p) => p.business_id).filter(Boolean))] as string[];
    const { data: productBiz } =
      productBizIds.length > 0
        ? await supabase.from("businesses").select("id, name, slug, industry, cover_image_url").in("id", productBizIds)
        : { data: [] };
    const productBizMap = new Map((productBiz || []).map((b) => [b.id, b]));

    // 3. Streams (replays) — title, description; join business
    const { data: streams } = await supabase
      .from("streams")
      .select("id, business_id, title, description, video_url, thumbnail_url, peak_viewers, is_live")
      .not("video_url", "is", null)
      .eq("is_live", false)
      .or(`title.ilike.${term},description.ilike.${term}`)
      .order("created_at", { ascending: false })
      .limit(limit);

    const streamBizIds = [...new Set((streams || []).map((s) => s.business_id).filter(Boolean))] as string[];
    const { data: streamBiz } =
      streamBizIds.length > 0
        ? await supabase.from("businesses").select("id, name, slug, industry, cover_image_url").in("id", streamBizIds)
        : { data: [] };
    const streamBizMap = new Map((streamBiz || []).map((b) => [b.id, b]));

    // 4. Categories — match label; return category + businesses in that industry
    const qLower = q.toLowerCase();
    const matchedCategories = CATEGORIES.filter(
      (c) => c.label.toLowerCase().includes(qLower) || c.id.toLowerCase().includes(qLower)
    );
    const catIndustries = [...new Set(matchedCategories.map((c) => c.industry))];
    const { data: catBiz } =
      catIndustries.length > 0
        ? await supabase
            .from("businesses")
            .select("id, name, slug, industry, locality, cover_image_url, is_live, live_viewer_count")
            .in("industry", catIndustries)
            .limit(limit)
        : { data: [] };

    return NextResponse.json({
      businesses: uniqueBiz.map((b) => ({
        type: "business" as const,
        id: b.id,
        name: b.name,
        slug: b.slug,
        industry: b.industry,
        sectorLabel: SECTOR_LABELS[b.industry] || b.industry,
        locality: b.locality,
        description: b.description,
        cover_image_url: b.cover_image_url,
        is_live: b.is_live ?? false,
        live_viewer_count: b.live_viewer_count ?? 0,
        href: `/biz/${b.slug}`,
      })),
      products: (products || []).map((p) => {
        const b = p.business_id ? productBizMap.get(p.business_id) : null;
        return {
          type: "product" as const,
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          image_urls: p.image_urls || [],
          business_id: p.business_id,
          business_name: b?.name,
          business_slug: b?.slug,
          sectorLabel: b ? SECTOR_LABELS[b.industry] || b.industry : null,
          href: b ? `/biz/${b.slug}` : null,
        };
      }),
      streams: (streams || []).map((s) => {
        const b = s.business_id ? streamBizMap.get(s.business_id) : null;
        return {
          type: "stream" as const,
          id: s.id,
          title: s.title,
          description: s.description,
          video_url: s.video_url,
          thumbnail_url: s.thumbnail_url,
          peak_viewers: s.peak_viewers ?? 0,
          business_id: s.business_id,
          business_name: b?.name,
          business_slug: b?.slug,
          sectorLabel: b ? SECTOR_LABELS[b.industry] || b.industry : null,
          href: b ? `/pjazza/live-shop/${b.slug}` : null,
        };
      }),
      categories: matchedCategories.map((c) => ({
        type: "category" as const,
        id: c.id,
        label: c.label,
        emoji: c.emoji,
        industry: c.industry,
        businesses: (catBiz || []).filter((b) => b.industry === c.industry).slice(0, 5),
        href: `/discover/${c.id}`,
      })),
    });
  } catch (e) {
    console.error("[SEARCH API]", e);
    return NextResponse.json(
      { businesses: [], products: [], streams: [], categories: [] },
      { status: 500 }
    );
  }
}
