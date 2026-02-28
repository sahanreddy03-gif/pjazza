/**
 * POST /api/admin/enrich-openai
 * Generate AI descriptions for businesses (OpenAI)
 *
 * ?secret=ADMIN_IMPORT_SECRET
 * Body: { business_ids?: string[] }
 */

import { createAdminClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateBusinessDescription } from "@/src/lib/integrations/openai-enrich";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (process.env.ADMIN_IMPORT_SECRET && secret !== process.env.ADMIN_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY required" }, { status: 500 });
  }

  let body: { business_ids?: string[] } = {};
  try {
    body = await req.json();
  } catch {}

  const supabase = createAdminClient();
  let query = supabase
    .from("businesses")
    .select("id, name, slug, industry, locality, description");

  if (body.business_ids?.length) {
    query = query.in("id", body.business_ids);
  }

  const { data: businesses, error } = await query.limit(30);
  if (error || !businesses?.length) {
    return NextResponse.json({ success: false, enriched: 0, message: "No businesses" });
  }

  let enriched = 0;

  for (const b of businesses) {
    const desc = await generateBusinessDescription(
      b.name,
      b.industry ?? "tourism",
      b.locality ?? "Malta",
      b.description ?? undefined
    );

    if (desc) {
      const { error: upErr } = await supabase
        .from("businesses")
        .update({ description: desc, updated_at: new Date().toISOString() })
        .eq("id", b.id);

      if (!upErr) enriched++;
    }
    await new Promise((r) => setTimeout(r, 500)); // rate limit
  }

  return NextResponse.json({ success: true, enriched, total: businesses.length });
}
