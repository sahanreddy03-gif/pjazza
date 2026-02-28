/**
 * Supabase middleware — refreshes auth session and updates cookies
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do not add code between createServerClient and this call
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /pjazza/business/* (except onboard) — redirect unauthenticated users to agent
  const path = request.nextUrl.pathname;
  const isBusinessRoute = path.startsWith("/pjazza/business");
  const isOnboardRoute = path === "/pjazza/business/onboard" || path.startsWith("/pjazza/business/onboard/");

  if (isBusinessRoute && !isOnboardRoute && !user) {
    const url = new URL("/pjazza/agent", request.url);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
