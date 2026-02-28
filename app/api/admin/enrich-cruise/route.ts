/**
 * POST /api/admin/enrich-cruise
 * Scrape Valletta Cruise Port and upsert into cruise_arrivals
 *
 * ?secret=ADMIN_IMPORT_SECRET
 */

import { createAdminClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { enrichCruiseArrivals } from "@/src/lib/enrichment/cruise-arrivals";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (process.env.ADMIN_IMPORT_SECRET && secret !== process.env.ADMIN_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await enrichCruiseArrivals();
  const arrivals = result.data?.arrivals as { ship_name: string; port: string; arrival_at: string; passenger_count: number | null; best_live_start: string | null; best_live_end: string | null }[] | undefined;

  if (!arrivals?.length) {
    return NextResponse.json({
      success: false,
      message: "No arrivals scraped",
      errors: result.errors,
    });
  }

  const supabase = createAdminClient();
  let inserted = 0;

  for (const a of arrivals) {
    const { error } = await supabase.from("cruise_arrivals").insert({
      ship_name: a.ship_name,
      port: a.port || "Grand Harbour",
      arrival_at: a.arrival_at,
      passenger_count: a.passenger_count,
      best_live_start: a.best_live_start,
      best_live_end: a.best_live_end,
    });
    if (!error) inserted++;
  }

  return NextResponse.json({
    success: true,
    arrivals_scraped: arrivals.length,
    inserted,
    source: result.source,
  });
}
