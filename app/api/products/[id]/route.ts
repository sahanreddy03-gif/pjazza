import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function verifyOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productId: string,
  userId: string
) {
  const { data } = await supabase
    .from("products")
    .select("id, business_id")
    .eq("id", productId)
    .single();
  if (!data) return false;
  const { data: biz } = await supabase
    .from("businesses")
    .select("owner_id")
    .eq("id", data.business_id)
    .eq("owner_id", userId)
    .maybeSingle();
  return !!biz;
}

/**
 * PATCH /api/products/[id] — update product (owner only)
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

    const owns = await verifyOwnership(supabase, id, user.id);
    if (!owns) {
      return NextResponse.json(
        { error: "Product not found or you do not own it" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { data, error } = await supabase
      .from("products")
      .update({
        ...(body.name != null && { name: body.name }),
        ...(body.description != null && { description: body.description }),
        ...(body.price != null && { price: body.price }),
        ...(body.image_urls != null && { image_urls: body.image_urls }),
        ...(body.is_available != null && { is_available: body.is_available }),
      })
      .eq("id", id)
      .select("id, name, description, price, image_urls, is_available")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("[PRODUCT PATCH]", e);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id] — delete product (owner only)
 */
export async function DELETE(
  _req: NextRequest,
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

    const owns = await verifyOwnership(supabase, id, user.id);
    if (!owns) {
      return NextResponse.json(
        { error: "Product not found or you do not own it" },
        { status: 404 }
      );
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[PRODUCT DELETE]", e);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
