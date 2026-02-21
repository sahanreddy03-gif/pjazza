import { createClient } from "@/src/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("id, name, slug")
      .order("name");

    if (error) return NextResponse.json([], { status: 200 });
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
