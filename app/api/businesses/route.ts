import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase();

  try {
    const supabase = await createClient();
    let query = supabase
      .from("businesses")
      .select("id, name, slug, industry, locality, cover_image_url, logo_url, image_urls, google_review_count, google_rating, tripadvisor_review_count, tripadvisor_rating, vibe_summary, address_full")
      .order("name");

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
