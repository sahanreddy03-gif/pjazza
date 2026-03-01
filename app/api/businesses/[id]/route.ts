import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * PATCH /api/businesses/[id] — update business (owner only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { data, error } = await supabase
      .from("businesses")
      .update({
        ...(body.name != null && { name: body.name }),
        ...(body.description != null && { description: body.description }),
        ...(body.address != null && { address: body.address }),
        ...(body.locality != null && { locality: body.locality }),
        ...(body.phone != null && { phone: body.phone }),
        ...(body.website_url != null && { website_url: body.website_url }),
        ...(body.email != null && { email: body.email }),
        ...(body.address_full != null && { address_full: body.address_full }),
        ...(body.cover_image_url != null && { cover_image_url: body.cover_image_url }),
        ...(body.subscription != null && { subscription: body.subscription }),
        ...(body.price_tier != null && { price_tier: body.price_tier }),
        ...(body.dietary_tags != null && { dietary_tags: Array.isArray(body.dietary_tags) ? body.dietary_tags : [] }),
        ...(body.wheelchair_accessible != null && { wheelchair_accessible: !!body.wheelchair_accessible }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("owner_id", user.id)
      .select("id, name, description, locality")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json(
        { error: "Business not found or you do not own it" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("[BUSINESS PATCH]", e);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}
