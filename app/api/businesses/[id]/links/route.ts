import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/** Allowed link types (matches BUSINESS_LISTING_RESEARCH.md) */
export const LINK_TYPES = [
  // Core
  "website", "email", "phone",
  // Social
  "facebook", "instagram", "linkedin", "tiktok", "x", "youtube", "pinterest",
  // Industry-specific
  "menu", "deliveroo", "wolt", "ubereats", "reservations", "opentable", "resy", "thefork",
  "airbnb", "booking", "vrbo", "tripadvisor", "google_maps", "whatsapp", "eventbrite", "meetup", "facebook_events",
  // Often overlooked
  "apple_maps", "waze", "trustpilot", "vimeo", "pdf_menu", "pdf_brochure", "virtual_tour", "shopify", "woocommerce", "etsy",
  "newsletter", "press", "bolt", "wolt_delivery", "other",
] as const;

export type LinkType = (typeof LINK_TYPES)[number];

/** GET /api/businesses/[id]/links — list links for a business */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("business_links")
      .select("id, link_type, url, label")
      .eq("business_id", id)
      .order("link_type");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (e) {
    console.error("[LINKS GET]", e);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

/** POST /api/businesses/[id]/links — add or update a link (owner only) */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { link_type, url, label } = body;
    if (!link_type || !url || typeof url !== "string") {
      return NextResponse.json({ error: "link_type and url required" }, { status: 400 });
    }
    const norm = (url as string).trim();
    if (!norm) return NextResponse.json({ error: "url required" }, { status: 400 });

    const valid = LINK_TYPES.includes(link_type);
    if (!valid) return NextResponse.json({ error: `Invalid link_type: ${link_type}` }, { status: 400 });

    const { data, error } = await supabase
      .from("business_links")
      .upsert(
        { business_id: id, link_type, url: norm, label: label || null },
        { onConflict: "business_id,link_type" }
      )
      .select("id, link_type, url, label")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[LINKS POST]", e);
    return NextResponse.json({ error: "Failed to save link" }, { status: 500 });
  }
}

/** DELETE /api/businesses/[id]/links?link_type=facebook — remove a link (owner only) */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const linkType = req.nextUrl.searchParams.get("link_type");
    if (!linkType) return NextResponse.json({ error: "link_type required" }, { status: 400 });

    const { error } = await supabase
      .from("business_links")
      .delete()
      .eq("business_id", id)
      .eq("link_type", linkType);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[LINKS DELETE]", e);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
