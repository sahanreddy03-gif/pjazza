/**
 * GET /api/businesses/[id]/stats
 * Streaming streak + response time SLA for owner
 */

import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: biz } = await supabase
      .from("businesses")
      .select("owner_id, streaming_streak")
      .eq("id", id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!biz) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Streaming streak: use DB value or compute from streams (consecutive days)
    let streak = biz.streaming_streak ?? 0;
    const { data: streams } = await supabase
      .from("streams")
      .select("started_at")
      .eq("business_id", id)
      .not("started_at", "is", null)
      .order("started_at", { ascending: false })
      .limit(30);

    if (streams?.length && streak === 0) {
      const dates = new Set(
        streams.map((s) => new Date(s.started_at).toISOString().slice(0, 10))
      );
      let consecutive = 0;
      const d = new Date();
      for (let i = 0; i < 365; i++) {
        const dayStr = d.toISOString().slice(0, 10);
        if (dates.has(dayStr)) consecutive++;
        else if (consecutive > 0) break;
        d.setDate(d.getDate() - 1);
      }
      streak = consecutive;
    }

    // Response time SLA: avg time from booking created to capture/approve (pending → completed)
    const { data: bookings } = await supabase
      .from("bookings")
      .select("created_at, updated_at, status")
      .eq("business_id", id)
      .eq("status", "completed")
      .limit(20);

    let avgResponseMinutes: number | null = null;
    if (bookings?.length) {
      const times = bookings
        .filter((b) => b.updated_at && b.created_at)
        .map((b) => (new Date(b.updated_at!).getTime() - new Date(b.created_at!).getTime()) / (60 * 1000));
      if (times.length) avgResponseMinutes = Math.round(times.reduce((a, t) => a + t, 0) / times.length);
    }

    return NextResponse.json({
      streaming_streak: streak,
      avg_response_minutes: avgResponseMinutes,
    });
  } catch (e) {
    console.error("[BUSINESS STATS]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
