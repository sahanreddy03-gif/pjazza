/**
 * POST /api/stripe/subscription
 * Create Stripe Checkout session for business subscription (Starter €49 / Pro €149)
 * Body: { business_id: string, plan: 'starter' | 'pro' }
 *
 * Create Price IDs in Stripe Dashboard:
 * STRIPE_PRICE_STARTER=price_xxx (€49/mo recurring)
 * STRIPE_PRICE_PRO=price_xxx (€149/mo recurring)
 */

import { createClient } from "@/src/lib/supabase/server";
import { getStripe } from "@/src/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://maltaverse.live";

const PLAN_PRICES: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro: process.env.STRIPE_PRICE_PRO,
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { business_id, plan } = body;
    if (!business_id || !plan || !["starter", "pro"].includes(plan)) {
      return NextResponse.json({ error: "business_id and plan (starter|pro) required" }, { status: 400 });
    }

    const priceId = PLAN_PRICES[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: `STRIPE_PRICE_${plan.toUpperCase()} not configured. Create price in Stripe Dashboard.` },
        { status: 500 }
      );
    }

    const { data: biz } = await supabase
      .from("businesses")
      .select("id, name, owner_id")
      .eq("id", business_id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!biz) return NextResponse.json({ error: "Business not found" }, { status: 404 });

    const stripe = getStripe();
    if (!stripe || process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_placeholder")) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/pjazza/business/subscription?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/pjazza/business/subscription?canceled=1`,
      customer_email: user.email ?? undefined,
      metadata: {
        business_id,
        plan,
        owner_id: user.id,
      },
      subscription_data: {
        metadata: { business_id, plan },
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error("[STRIPE SUBSCRIPTION]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create checkout" },
      { status: 500 }
    );
  }
}
