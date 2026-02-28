/**
 * PATCH /api/bookings/[id] — owner can set seller_photo_url (photo proof)
 * For product/service bookings: business uploads proof before consumer approves.
 */

import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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
    const { seller_photo_url } = body;

    if (typeof seller_photo_url !== "string" || !seller_photo_url.trim()) {
      return NextResponse.json(
        { error: "seller_photo_url required" },
        { status: 400 }
      );
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("id, business_id, status")
      .eq("id", id)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const { data: biz } = await supabase
      .from("businesses")
      .select("owner_id")
      .eq("id", booking.business_id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!biz) {
      return NextResponse.json(
        { error: "You do not own this business" },
        { status: 403 }
      );
    }

    if (booking.status !== "pending") {
      return NextResponse.json(
        { error: "Can only add proof for pending bookings" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({
        seller_photo_url: seller_photo_url.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, seller_photo_url")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("[BOOKING PATCH]", e);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}
