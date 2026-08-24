import { NextResponse, type NextRequest } from "next/server";

import { refreshNative } from "@/lib/api-client/client";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth-native/constants";
import { verifyAccessToken } from "@/lib/auth-native/verify";

const GATED_PREFIXES = [
  "/onboarding",
  "/research",
  "/settings",
  "/profile",
  "/companies",
  "/overview",
];

export async function middleware(request: NextRequest) {
  const isGated = GATED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (!isGated) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  let userId = accessToken ? await verifyAccessToken(accessToken) : null;

  // Access token missing or expired: try the refresh token before giving up,
  // so a session stays alive without the user noticing.
  let refreshedAccessToken: string | null = null;
  if (!userId) {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (refreshToken) {
      try {
        refreshedAccessToken = await refreshNative(refreshToken);
        userId = await verifyAccessToken(refreshedAccessToken);
      } catch {
        userId = null;
      }
    }
  }

  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!refreshedAccessToken) {
    return NextResponse.next();
  }

  // Write the refreshed value onto the *request* cookies too, not just the
  // response, so a Server
  // Component further down the same request (e.g. (dashboard)/layout.tsx)
  // sees the fresh token instead of the expired one it arrived with.
  request.cookies.set(ACCESS_TOKEN_COOKIE, refreshedAccessToken);
  const response = NextResponse.next({ request });
  response.cookies.set(ACCESS_TOKEN_COOKIE, refreshedAccessToken, {
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and Next internals. Ungated
     * routes return early above without touching cookies or the network.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
