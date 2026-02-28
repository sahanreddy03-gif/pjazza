/**
 * POST /api/admin/import-freelancers
 * Import freelancers/tradespeople as businesses (industry: freelancer)
 * Body: { freelancers: Array<{ name, specialty, locality, hourly, phone?, website? }> }
 *
 * ?secret=ADMIN_IMPORT_SECRET
 */

import { createAdminClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "freelancer-" + Math.random().toString(36).slice(2, 8);
}

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface FreelancerRow {
  name: string;
  specialty: string;
  locality: string;
  hourly?: string;
  phone?: string;
  website?: string;
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (process.env.ADMIN_IMPORT_SECRET && secret !== process.env.ADMIN_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { freelancers: FreelancerRow[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const freelancers = body.freelancers;
  if (!Array.isArray(freelancers) || freelancers.length === 0) {
    return NextResponse.json({ error: "freelancers array required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  let inserted = 0;

  for (const f of freelancers.slice(0, 100)) {
    const name = f.name?.trim();
    const specialty = f.specialty?.trim() || "Service";
    const locality = f.locality?.trim() || "Malta";
    if (!name) continue;

    const slug = slugify(`${name}-${specialty}-${locality}`);
    const id = uuid();

    const { error } = await supabase.from("businesses").upsert(
      {
        id,
        name: `${name} · ${specialty}`,
        slug,
        industry: "freelancer",
        locality,
        description: `${specialty} in ${locality}. Book via PJAZZA.`,
        phone: f.phone ?? null,
        website_url: f.website ?? null,
        verified: false,
      },
      { onConflict: "slug", ignoreDuplicates: true }
    );

    if (!error) inserted++;
  }

  return NextResponse.json({
    success: true,
    imported: inserted,
    total: freelancers.length,
  });
}
