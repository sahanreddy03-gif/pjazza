import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const name = body?.name?.trim();
    const industry = body?.industry?.trim() || "retail";
    const locality = body?.locality?.trim() || "Malta";

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Business name required (min 2 chars)" }, { status: 400 });
    }

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const { data: existing } = await supabase.from("businesses").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${++attempt}`;
    }

    const { data, error } = await supabase
      .from("businesses")
      .insert({
        name,
        slug,
        industry,
        locality,
        owner_id: user.id,
        verified: false,
        is_live: false,
        live_viewer_count: 0,
      })
      .select("id, name, slug, locality")
      .single();

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "Business already exists" }, { status: 409 });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("[POST /api/businesses]", e);
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase();
  const mine = searchParams.get("mine") === "1";

  try {
    const supabase = await createClient();
    let query = supabase
      .from("businesses")
      .select("id, name, slug, industry, locality, description, address_full, phone, website_url, cover_image_url, logo_url, image_urls, google_review_count, google_rating, tripadvisor_review_count, tripadvisor_rating, vibe_summary, owner_id, subscription, price_tier, dietary_tags, wheelchair_accessible")
      .order("name");

    if (mine) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return NextResponse.json([], { status: 200 });
      query = query.eq("owner_id", user.id);
    }

    if (q && q.length >= 2) {
      query = query.or(`name.ilike.%${q}%,locality.ilike.%${q}%,industry.ilike.%${q}%`);
    }

    const { data, error } = await query.limit(q ? 20 : 500);

    if (error) return NextResponse.json([], { status: 200 });
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
