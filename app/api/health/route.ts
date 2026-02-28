/**
 * GET /api/health
 * Health check — returns 200 if DB reachable
 * Used for Vercel monitoring, uptime checks
 */

import { createClient } from "@/src/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("businesses").select("id").limit(1).maybeSingle();
    if (error) {
      return NextResponse.json({ status: "error", db: "unreachable", message: error.message }, { status: 503 });
    }
    return NextResponse.json({ status: "ok", db: "reachable" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ status: "error", db: "unreachable", message }, { status: 503 });
  }
}
