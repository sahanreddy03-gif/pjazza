import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/businesses/claim
 * Claim an unclaimed business. Requires auth.
 * Body: { business_id: string }
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
    const businessId = body?.business_id;
    if (!businessId || typeof businessId !== "string") {
      return NextResponse.json(
        { error: "Missing business_id" },
        { status: 400 }
      );
    }

    // Update only if owner_id is null (unclaimed)
    const { data, error } = await supabase
      .from("businesses")
      .update({ owner_id: user.id, updated_at: new Date().toISOString() })
      .eq("id", businessId)
      .is("owner_id", null)
      .select("id, name, slug")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json(
        { error: "Business not found or already claimed" },
        { status: 409 }
      );
    }

    return NextResponse.json({ ok: true, business: data });
  } catch (e) {
    console.error("[CLAIM]", e);
    return NextResponse.json(
      { error: "Failed to claim" },
      { status: 500 }
    );
  }
}
