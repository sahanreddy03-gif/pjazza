/**
 * GET /api/businesses/[id]/stream-allow
 * Check if business can go live (subscription limit).
 * Free: 3 lives/month. Starter/Pro/Enterprise: unlimited.
 */

import { createClient } from "@/src/lib/supabase/server";
import { SUBSCRIPTIONS } from "@/src/config/commissions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: biz } = await supabase
      .from("businesses")
      .select("id, owner_id, subscription")
      .eq("id", id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!biz) return NextResponse.json({ error: "Business not found" }, { status: 404 });

    const plan = (biz.subscription || "free") as keyof typeof SUBSCRIPTIONS;
    const config = SUBSCRIPTIONS[plan];
    const limit = config.livePerMonth;

    if (limit === null) {
      return NextResponse.json({ allowed: true, remaining: null, limit: null });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { count } = await supabase
      .from("streams")
      .select("id", { count: "exact", head: true })
      .eq("business_id", id)
      .gte("created_at", startOfMonth);

    const used = count ?? 0;
    const remaining = Math.max(0, limit - used);
    const allowed = remaining > 0;

    return NextResponse.json({ allowed, remaining, limit, used });
  } catch (e) {
    console.error("[STREAM ALLOW]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
