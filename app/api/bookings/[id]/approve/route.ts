/**
 * POST /api/bookings/[id]/approve — consumer approves (releases escrow)
 * For product/service bookings: consumer approves when satisfied.
 * Triggers capture same as business capture.
 */

import { createClient } from "@/src/lib/supabase/server";
import { getStripe } from "@/src/lib/stripe";
import { sendPushToUser } from "@/src/lib/push";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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

    const { data: booking, error: bookErr } = await supabase
      .from("bookings")
      .select("id, consumer_id, business_id, stripe_payment_intent_id, status, booking_type, seller_photo_url")
      .eq("id", id)
      .single();

    if (bookErr || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.consumer_id !== user.id) {
      return NextResponse.json(
        { error: "Not your booking" },
        { status: 403 }
      );
    }

    if (booking.status !== "pending") {
      return NextResponse.json(
        { error: "Booking already completed or cancelled" },
        { status: 409 }
      );
    }

    // For product/service types, seller must have uploaded proof before consumer can approve
    const needsProof = ["product", "service"].includes(booking.booking_type ?? "");
    if (needsProof && !booking.seller_photo_url) {
      return NextResponse.json(
        { error: "Waiting for seller to upload proof" },
        { status: 400 }
      );
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("owner_id, name")
      .eq("id", booking.business_id)
      .maybeSingle();

    const stripe = getStripe();
    if (!booking.stripe_payment_intent_id || !stripe) {
      return NextResponse.json(
        { error: "Payment not configured" },
        { status: 500 }
      );
    }

    await stripe.paymentIntents.capture(booking.stripe_payment_intent_id);

    await supabase
      .from("bookings")
      .update({
        status: "completed",
        buyer_approved: true,
        buyer_approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (business?.owner_id) {
      sendPushToUser(business.owner_id, {
        title: "Booking approved",
        body: `Customer approved — payment released for ${business.name}`,
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, status: "completed" });
  } catch (e) {
    console.error("[BOOKING APPROVE]", e);
    return NextResponse.json(
      { error: "Failed to approve" },
      { status: 500 }
    );
  }
}
