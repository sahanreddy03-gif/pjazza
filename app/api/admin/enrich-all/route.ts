/**
 * POST /api/admin/enrich-all
 * Run all enrichment pipelines in sequence:
 * 1. Google Places (business photos, ratings, address, phone, website)
 * 2. Product scraping (from business website_url)
 * 3. Cruise arrivals (Valletta Cruise Port schedule)
 *
 * ?secret=ADMIN_IMPORT_SECRET
 * Body: { google?: boolean, products?: boolean, cruise?: boolean }
 *   All default true if omitted
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (process.env.ADMIN_IMPORT_SECRET && secret !== process.env.ADMIN_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let body: { google?: boolean; products?: boolean; cruise?: boolean; openai?: boolean } = {};
  try {
    body = await req.json();
  } catch {}

  const runGoogle = body.google !== false;
  const runProducts = body.products !== false;
  const runCruise = body.cruise !== false;
  const runOpenAI = body.openai !== false;

  const results: Record<string, unknown> = {};

  if (runGoogle) {
    try {
      const res = await fetch(`${base}/api/admin/enrich?secret=${encodeURIComponent(secret || "")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      results.google = await res.json();
    } catch (e) {
      results.google = { error: e instanceof Error ? e.message : "Failed" };
    }
  }

  if (runProducts) {
    try {
      const res = await fetch(`${base}/api/admin/enrich-products?secret=${encodeURIComponent(secret || "")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      results.products = await res.json();
    } catch (e) {
      results.products = { error: e instanceof Error ? e.message : "Failed" };
    }
  }

  if (runCruise) {
    try {
      const res = await fetch(`${base}/api/admin/enrich-cruise?secret=${encodeURIComponent(secret || "")}`, {
        method: "POST",
      });
      results.cruise = await res.json();
    } catch (e) {
      results.cruise = { error: e instanceof Error ? e.message : "Failed" };
    }
  }

  if (runOpenAI) {
    try {
      const res = await fetch(`${base}/api/admin/enrich-openai?secret=${encodeURIComponent(secret || "")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      results.openai = await res.json();
    } catch (e) {
      results.openai = { error: e instanceof Error ? e.message : "Failed" };
    }
  }

  return NextResponse.json({
    success: true,
    results,
  });
}
