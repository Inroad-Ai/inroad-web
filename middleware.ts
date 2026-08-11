import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Runs on every request. Two jobs: keep the Supabase session cookie fresh
// (the SSR client can't do this from a Server Component alone, since those
// can't write cookies), and bounce signed-out users out of gated routes
// before a page even renders. Layouts still double-check with getUser() -
// this is the fast path, not the only path.
const GATED_PREFIXES = ["/onboarding", "/research", "/settings"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isGated = GATED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (isGated && !user) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and Next internals, so the
     * session cookie stays fresh no matter what page the user is on.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
