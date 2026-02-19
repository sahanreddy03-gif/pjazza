/**
 * POST /api/bookings — create booking + Stripe PaymentIntent (escrow)
 */

import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import {
  calculateCommission,
  COMMISSION_RATES,
} from "@/src/config/commissions";
import type { IndustryType } from "@/src/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      business_id,
      booking_type,
      date,
      time,
      guests,
      notes,
      amount,
    } = body;

    if (!business_id || typeof amount !== "number" || amount < 0) {
      return NextResponse.json(
        { error: "business_id and amount required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch business for industry (optional for seed/demo)
    const { data: business } = await supabase
      .from("businesses")
      .select("industry")
      .eq("id", business_id)
      .single();

    const industry = (business?.industry ?? "dining") as IndustryType;
    const { commission, netBusiness } = calculateCommission(amount, industry);
    const config = COMMISSION_RATES[industry];
    const commission_rate = config.rate;
    const commission_amount = commission;
    const net_business_amount = netBusiness;

    // Create Stripe PaymentIntent (manual capture = escrow)
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: "eur",
      capture_method: "manual",
      metadata: {
        business_id,
        booking_type: booking_type ?? "table",
      },
    });

    // Create booking in DB (skipped if tables not set up)
    let bookingId: string | null = null;
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .insert({
        business_id,
        consumer_id: null, // from auth when available
        booking_type: booking_type ?? "table",
        date: date ?? null,
        time: time ?? null,
        guests: guests ?? null,
        notes: notes ?? null,
        amount,
        commission_rate,
        commission_amount,
        net_business_amount,
        currency: "EUR",
        stripe_payment_intent_id: paymentIntent.id,
        status: "pending",
      })
      .select("id")
      .single();

    if (bookingErr) {
      // Rollback PaymentIntent if DB insert fails (e.g. missing migrations)
      await stripe.paymentIntents.cancel(paymentIntent.id);
      return NextResponse.json(
        {
          error:
            bookingErr.message ??
            "Failed to create booking. Ensure Supabase migrations are run.",
        },
        { status: 500 }
      );
    }

    if (booking) bookingId = booking.id;

    return NextResponse.json({
      bookingId,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Bookings API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
