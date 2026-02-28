import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/cruise-arrivals — list next cruise arrivals for dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("cruise_arrivals")
      .select("id, ship_name, port, arrival_at, passenger_count, best_live_start, best_live_end")
      .gte("arrival_at", new Date().toISOString())
      .order("arrival_at", { ascending: true })
      .limit(5);

    if (error) return NextResponse.json([], { status: 200 });
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
