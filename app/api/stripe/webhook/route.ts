/**
 * POST /api/stripe/webhook
 * Handles: customer.subscription.created, updated, deleted
 * Updates businesses.subscription from metadata
 */

import { createAdminClient } from "@/src/lib/supabase/server";
import { getStripe } from "@/src/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !sig) {
    return NextResponse.json({ error: "Webhook secret required" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const businessId = sub.metadata?.business_id;
    const plan = sub.metadata?.plan as string | undefined;
    if (businessId && plan && ["starter", "pro", "enterprise"].includes(plan)) {
      await supabase
        .from("businesses")
        .update({
          subscription: plan,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId);
    }
  } else if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const businessId = sub.metadata?.business_id;
    if (businessId) {
      await supabase
        .from("businesses")
        .update({
          subscription: "free",
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId);
    }
  }

  return NextResponse.json({ received: true });
}
