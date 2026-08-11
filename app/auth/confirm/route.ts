import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { resolvePostAuthPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Where the link in a signup-confirmation email points. Verifies the OTP
// token, establishes the session, then routes the same way the OAuth
// callback does.
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // A recovery link's only job is letting the user set a new password - it
  // shouldn't drop them straight into the dashboard with no chance to do that.
  if (type === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", request.url));
  }

  const path = await resolvePostAuthPath(supabase, data.user.id);
  return NextResponse.redirect(new URL(path, request.url));
}
