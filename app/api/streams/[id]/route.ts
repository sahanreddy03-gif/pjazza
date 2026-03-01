import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: stream } = await supabase
      .from("streams")
      .select("id, business_id")
      .eq("id", id)
      .maybeSingle();
    if (!stream) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: biz } = await supabase
      .from("businesses")
      .select("owner_id")
      .eq("id", stream.business_id)
      .maybeSingle();
    if (!biz || biz.owner_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await supabase
      .from("streams")
      .update({ is_live: false, ended_at: new Date().toISOString() })
      .eq("id", id);

    if (stream.business_id) {
      await supabase
        .from("businesses")
        .update({ is_live: false, live_viewer_count: 0, updated_at: new Date().toISOString() })
        .eq("id", stream.business_id);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[PATCH /api/streams]", e);
    return NextResponse.json({ error: "Failed to end stream" }, { status: 500 });
  }
}
