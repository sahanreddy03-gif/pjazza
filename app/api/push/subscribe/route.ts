/**
 * POST /api/push/subscribe
 * Save Web Push subscription for the current user.
 * Body: { subscription: { endpoint, keys: { p256dh, auth } } }
 */

import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const sub = body?.subscription;
    if (!sub?.endpoint) return NextResponse.json({ error: "subscription.endpoint required" }, { status: 400 });

    const p256dh = sub.keys?.p256dh ?? null;
    const auth = sub.keys?.auth ?? null;

    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: user.id,
        endpoint: sub.endpoint,
        p256dh: p256dh || null,
        auth: auth || null,
      },
      { onConflict: "user_id,endpoint" }
    );

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[PUSH SUBSCRIBE]", e);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}
