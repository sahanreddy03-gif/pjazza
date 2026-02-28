import { createClient } from "@/src/lib/supabase/server";
import { getStripe } from "@/src/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/bookings/[id]/capture — capture held payment (business owner only)
 * Releases escrow: funds transfer to business after completion.
 */
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
      .select("id, business_id, stripe_payment_intent_id, status")
      .eq("id", id)
      .single();

    if (bookErr || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status !== "pending") {
      return NextResponse.json(
        { error: "Booking already captured or cancelled" },
        { status: 409 }
      );
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    return NextResponse.json({ ok: true, status: "completed" });
  } catch (e) {
    console.error("[BOOKING CAPTURE]", e);
    return NextResponse.json(
      { error: "Failed to capture payment" },
      { status: 500 }
    );
  }
}
