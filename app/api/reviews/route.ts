/**
 * GET /api/reviews?business_id=... — list PJAZZA native reviews for a business
 * POST /api/reviews — create review (auth required, consumer only, after completed booking)
 */

import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("business_id");
  if (!businessId) {
    return NextResponse.json([], { status: 200 });
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, text, created_at")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return NextResponse.json([], { status: 200 });
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

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
    const { booking_id, rating, text } = body;
    if (!booking_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid booking_id or rating (1-5)" },
        { status: 400 }
      );
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("id, consumer_id, business_id, status")
      .eq("id", booking_id)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (booking.consumer_id !== user.id) {
      return NextResponse.json({ error: "Not your booking" }, { status: 403 });
    }
    if (booking.status !== "completed") {
      return NextResponse.json(
        { error: "Can only review completed bookings" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("booking_id", booking_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Already reviewed" },
        { status: 409 }
      );
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        booking_id,
        consumer_id: user.id,
        business_id: booking.business_id,
        rating: Number(rating),
        text: (text ?? "").trim() || null,
      })
      .select("id, rating, text, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(review);
  } catch (e) {
    console.error("[REVIEWS POST]", e);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
