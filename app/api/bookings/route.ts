/**
 * GET /api/bookings — list bookings for a business (owner) or consumer
 * Query: ?business_id=... (owner) or ?consumer=1 (consumer)
 *
 * POST /api/bookings — create booking + Stripe PaymentIntent (escrow)
 * Requires auth. Uses Stripe Connect when business has stripe_account_id.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import {
  calculateCommission,
  INDUSTRY_TO_CONFIG,
  COMMISSION_RATES,
} from "@/src/config/commissions";
import type { IndustryType } from "@/src/types";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("business_id");
    const consumer = searchParams.get("consumer") === "1";

    if (businessId) {
      // Owner: fetch bookings for their business
      const { data: biz } = await supabase
        .from("businesses")
        .select("id")
        .eq("id", businessId)
        .eq("owner_id", user.id)
        .maybeSingle();
      if (!biz) {
        return NextResponse.json({ error: "Business not found" }, { status: 404 });
      }
      const { data, error } = await supabase
        .from("bookings")
        .select("id, consumer_id, business_id, amount, status, booking_type, date, time, guests, seller_photo_url, created_at")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) return NextResponse.json([], { status: 200 });
      return NextResponse.json(data ?? []);
    }

    if (consumer) {
      // Consumer: fetch their bookings
      const { data, error } = await supabase
        .from("bookings")
        .select("id, business_id, amount, status, booking_type, date, time, seller_photo_url, created_at")
        .eq("consumer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) return NextResponse.json([], { status: 200 });
      return NextResponse.json(data ?? []);
    }

    return NextResponse.json([], { status: 200 });
  } catch (e) {
    console.error("[BOOKINGS GET]", e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
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
      booking_type,
      date,
      time,
      guests,
      notes,
      amount,
      delivery_method,
      delivery_fee = 0,
    } = body;

    if (!business_id || typeof amount !== "number" || amount < 0) {
      return NextResponse.json(
        { error: "business_id and amount required" },
        { status: 400 }
      );
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("industry, stripe_account_id")
      .eq("id", business_id)
      .single();

    const industryKey =
      INDUSTRY_TO_CONFIG[(business?.industry ?? "").toLowerCase()] ??
      "dining";
    const industry = industryKey as IndustryType;
    const config = COMMISSION_RATES[industry];
    const { commission, netBusiness } = calculateCommission(amount, industry);
    const commission_rate = config.rate;
    const commission_amount = commission;
    const net_business_amount = netBusiness;

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });

    const amountCents = Math.round(amount * 100);
    const connectAccountId = business?.stripe_account_id;

    const piParams: Parameters<typeof stripe.paymentIntents.create>[0] = {
      amount: amountCents,
      currency: "eur",
      capture_method: "manual",
      metadata: {
        business_id,
        booking_type: booking_type ?? "table",
      },
    };

    if (connectAccountId) {
      piParams.transfer_data = {
        destination: connectAccountId,
        amount: Math.round(net_business_amount * 100),
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(piParams);

    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .insert({
        business_id,
        consumer_id: user.id,
        booking_type: booking_type ?? "table",
        date: date ?? null,
        time: time ?? null,
        guests: guests ?? null,
        notes: notes ?? null,
        amount,
        delivery_method: delivery_method ?? null,
        delivery_fee: typeof delivery_fee === "number" ? delivery_fee : 0,
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

    return NextResponse.json({
      bookingId: booking.id,
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
