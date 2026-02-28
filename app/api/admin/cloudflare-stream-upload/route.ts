/**
 * POST /api/admin/cloudflare-stream-upload
 * Create upload URL for Cloudflare Stream (broadcast video)
 *
 * ?secret=ADMIN_IMPORT_SECRET
 * Body: { filename: string, metadata?: Record<string, string> }
 */

import { NextRequest, NextResponse } from "next/server";
import { createStreamUploadUrl } from "@/src/lib/integrations/cloudflare-stream";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (process.env.ADMIN_IMPORT_SECRET && secret !== process.env.ADMIN_IMPORT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { filename?: string; metadata?: Record<string, string> } = {};
  try {
    body = await req.json();
  } catch {}

  const filename = body.filename || `upload-${Date.now()}.mp4`;
  const result = await createStreamUploadUrl(filename, body.metadata);

  if (!result) {
    return NextResponse.json(
      { error: "Cloudflare Stream not configured. Set CLOUDFLARE_STREAM_ACCOUNT_ID and CLOUDFLARE_STREAM_API_TOKEN." },
      { status: 500 }
    );
  }

  return NextResponse.json({ uploadUrl: result.uploadUrl, uid: result.uid });
}
