#!/usr/bin/env node
/**
 * Run all enrichment pipelines
 * Requires: ADMIN_IMPORT_SECRET, dev server or production URL
 *
 * Usage: npm run enrich:all
 * Or: ADMIN_IMPORT_SECRET=xxx node scripts/enrich-all.mjs
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = join(__dirname, "..", ".env.local");
    const env = readFileSync(envPath, "utf8");
    for (const line of env.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch (_) {}
}

loadEnv();

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const secret = process.env.ADMIN_IMPORT_SECRET;

if (!secret) {
  console.error("Missing ADMIN_IMPORT_SECRET. Add to .env.local");
  process.exit(1);
}

async function main() {
  console.log("Running all enrichment pipelines...\n");

  const res = await fetch(
    `${base}/api/admin/enrich-all?secret=${encodeURIComponent(secret)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ google: true, products: true, cruise: true }),
    }
  );

  if (!res.ok) {
    console.error("Enrich-all failed:", res.status, await res.text());
    process.exit(1);
  }

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
