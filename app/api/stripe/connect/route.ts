import { createClient } from "@/src/lib/supabase/server";
import { getStripe } from "@/src/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://maltaverse.live";

/**
 * POST /api/stripe/connect
 * Create Stripe Connect Express account and return onboarding link.
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

    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("id, name, stripe_account_id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (bizError || !business) {
      return NextResponse.json(
        { error: "Business not found or you do not own it" },
        { status: 404 }
      );
    }

    const stripe = getStripe();
    if (!stripe || process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_placeholder")) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    let accountId = business.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "MT",
        email: user.email ?? undefined,
        capabilities: {
          card_payments: { requested: true },
        },
      });
      accountId = account.id;

      await supabase
        .from("businesses")
        .update({
          stripe_account_id: accountId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId)
        .eq("owner_id", user.id);
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${SITE_URL}/pjazza/business/dashboard?stripe=refresh`,
      return_url: `${SITE_URL}/pjazza/business/dashboard?stripe=complete`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (e) {
    console.error("[STRIPE CONNECT]", e);
    return NextResponse.json(
      { error: "Failed to create Connect link" },
      { status: 500 }
    );
  }
}
