/**
 * POST /api/admin/set-crowd
 * Set crowd_pct for businesses (Crowd Intelligence display)
 * ?secret=ADMIN_IMPORT_SECRET
 * Body: { business_ids?: string[]; crowd_pct: number } or { all: true; crowd_pct: number }
 */

import { createAdminClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (process.env.ADMIN_IMPORT_SECRET && secret !== process.env.ADMIN_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { business_ids?: string[]; crowd_pct?: number; all?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "JSON body required: { business_ids?: string[], crowd_pct: number } or { all: true, crowd_pct: number }" },
      { status: 400 }
    );
  }

  const crowdPct = Math.min(100, Math.max(0, Number(body?.crowd_pct ?? 0) || 0));
  const supabase = createAdminClient();

  let query = supabase.from("businesses").update({
    crowd_pct: crowdPct,
    crowd_updated_at: new Date().toISOString(),
  });

  if (body.all) {
    // Update all businesses
  } else if (body.business_ids?.length) {
    query = query.in("id", body.business_ids);
  } else {
    return NextResponse.json(
      { error: "Provide business_ids or all: true" },
      { status: 400 }
    );
  }

  const { data, error } = await query.select("id");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    success: true,
    updated: (data || []).length,
    crowd_pct: crowdPct,
  });
}
