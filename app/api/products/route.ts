import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/products — create product (business owner only)
 * Body: { business_id, name, description?, price, image_urls?, is_available? }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      business_id,
      name,
      description,
      price,
      image_urls,
      is_available,
    } = body;

    if (!business_id || !name || typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { error: "business_id, name, and price required" },
        { status: 400 }
      );
    }

    const { data: biz } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", business_id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!biz) {
      return NextResponse.json(
        { error: "Business not found or you do not own it" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        business_id,
        name,
        description: description ?? null,
        price,
        image_urls: image_urls ?? [],
        is_available: is_available ?? true,
      })
      .select("id, name, description, price, image_urls, is_available")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("[PRODUCT POST]", e);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
