import { NextResponse, type NextRequest } from "next/server";

import { resolvePostAuthPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Where Google sends the user back after they approve the OAuth consent
// screen. Exchanges the ?code for a session, then routes to onboarding or
// the dashboard depending on whether a profile already exists.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const path = await resolvePostAuthPath(supabase, data.user.id);
  return NextResponse.redirect(new URL(path, request.url));
}
