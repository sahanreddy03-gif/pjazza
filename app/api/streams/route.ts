/**
 * GET /api/streams
 * Returns filtered streams for discover.
 * Query: ?tier=all|luxury|value|deals&dietary=halal,vegan&wheelchair=1
 * When logged in, auto-applies profile dietary_filters and accessibility_filters if not in query.
 */

import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { StreamRow } from "@/src/types/supabase";

const SECTOR_LABELS: Record<string, string> = {
  food: "Food & Dining",
  property: "Property",
  cars: "Cars & Auto",
  yachts: "Yachts & Marine",
  "home-services": "Home Services",
  wellness: "Wellness",
  fashion: "Fashion & Retail",
  electronics: "Electronics",
  tourism: "Tourism",
  education: "Education",
  pets: "Pets & Animals",
  beauty: "Beauty",
};

function streamToForList(
  s: StreamRow & { business?: { name: string; locality: string; industry: string; cover_image_url: string | null; slug?: string } }
) {
  const biz = s.business;
  const sector = biz?.industry || "retail";
  return {
    name: biz?.name || s.title || "Live Stream",
    location: biz?.locality || "Malta",
    viewers: s.peak_viewers ?? 0,
    category: SECTOR_LABELS[sector] || sector,
    img: s.thumbnail_url || biz?.cover_image_url || "/pjazza/images/thumb-food.jpg",
    rating: 4.7,
    businessId: s.business_id ?? undefined,
    slug: biz?.slug,
    videoUrl: s.video_url,
    roomId: s.room_id ?? (s.business_id ? `store-${s.business_id}` : null),
    isLive: s.is_live ?? false,
  };
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    let tier = searchParams.get("tier") || "all";
    let dietary = searchParams.get("dietary")?.split(",").filter(Boolean) ?? [];
    const wheelchair = searchParams.get("wheelchair") === "1";

    const { data: { user } } = await supabase.auth.getUser();
    let applyWheelchair = wheelchair;
    if (user && dietary.length === 0 && !wheelchair) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("dietary_filters, accessibility_filters")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.dietary_filters?.length) dietary = profile.dietary_filters as string[];
      if (profile?.accessibility_filters?.includes("wheelchair")) applyWheelchair = true;
    }

    let bizQuery = supabase
      .from("businesses")
      .select("id, name, locality, industry, cover_image_url, slug, dietary_tags, wheelchair_accessible, price_tier");

    if (tier !== "all") {
      if (tier === "luxury") bizQuery = bizQuery.eq("price_tier", "€€€");
      else if (tier === "value") bizQuery = bizQuery.in("price_tier", ["€", "€€"]);
      else if (tier === "deals") bizQuery = bizQuery.eq("price_tier", "€");
    }
    if (applyWheelchair) {
      bizQuery = bizQuery.eq("wheelchair_accessible", true);
    }
    if (dietary.length > 0) {
      bizQuery = bizQuery.overlaps("dietary_tags", dietary);
    }

    const { data: businesses } = await bizQuery;
    const bizIds = (businesses ?? []).map((b) => b.id);
    if (bizIds.length === 0 && (tier !== "all" || wheelchair || dietary.length > 0)) {
      return NextResponse.json([]);
    }

    let streamsQuery = supabase
      .from("streams")
      .select("*")
      .eq("is_live", true)
      .order("peak_viewers", { ascending: false })
      .limit(15);
    if (bizIds.length > 0) {
      streamsQuery = streamsQuery.in("business_id", bizIds);
    } else {
      const { data: allBiz } = await supabase.from("businesses").select("id").limit(50);
      const ids = (allBiz ?? []).map((b) => b.id);
      if (ids.length > 0) streamsQuery = streamsQuery.in("business_id", ids);
    }

    const { data: streams } = await streamsQuery;
    if (!streams?.length) {
      const { data: liveBiz } = await supabase
        .from("businesses")
        .select("id, name, locality, industry, cover_image_url, slug")
        .eq("is_live", true)
        .order("live_viewer_count", { ascending: false })
        .limit(6);
      if (liveBiz?.length) {
        return NextResponse.json(
          liveBiz.map((b) => ({
            name: b.name,
            location: b.locality || "Malta",
            viewers: 0,
            category: SECTOR_LABELS[b.industry] || b.industry,
            img: b.cover_image_url || "/pjazza/images/thumb-food.jpg",
            rating: 4.7,
            businessId: b.id,
            slug: b.slug,
            videoUrl: null,
            roomId: `store-${b.id}`,
            isLive: true,
          }))
        );
      }
      return NextResponse.json([]);
    }

    const bizMap = new Map((businesses ?? []).map((b) => [b.id, b]));
    const result = (streams as StreamRow[]).map((s) =>
      streamToForList({ ...s, business: s.business_id ? bizMap.get(s.business_id) : undefined })
    );
    return NextResponse.json(result);
  } catch (e) {
    console.error("[STREAMS API]", e);
    return NextResponse.json([], { status: 200 });
  }
}
