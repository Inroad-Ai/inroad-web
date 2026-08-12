/** Browser-side storage and refresh for the native (non-Supabase) auth
 * tokens from phase 2. Cookies, not localStorage, so middleware and server
 * layouts can read the same value without a round trip - the same reason
 * the existing Supabase session lives in a cookie rather than localStorage.
 *
 * Not httpOnly: these are written from client-side JS (AuthForm calls the
 * FastAPI backend directly with the typed api-client, per this phase's
 * brief), and a browser cannot set an httpOnly cookie from document.cookie
 * - only a server response's Set-Cookie header can. Getting real httpOnly
 * storage would mean routing every auth call through a Next.js server
 * route instead of calling the backend directly from AuthForm, which is a
 * bigger structural change than this phase asked for. This matches how
 * @supabase/ssr's browser client already stores the Supabase session here
 * (also non-httpOnly, for the same reason), so it's not a new trade-off,
 * just the same one this app already made once.
 */

import { logoutNative, refreshNative, type TokenPair } from "@/lib/api-client/client";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_TTL_SECONDS,
} from "./constants";

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function readCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function clearCookie(name: string): void {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function storeTokens(tokens: TokenPair): void {
  setCookie(ACCESS_TOKEN_COOKIE, tokens.access_token, ACCESS_TOKEN_TTL_SECONDS);
  setCookie(REFRESH_TOKEN_COOKIE, tokens.refresh_token, REFRESH_TOKEN_TTL_SECONDS);
}

export function clearTokens(): void {
  clearCookie(ACCESS_TOKEN_COOKIE);
  clearCookie(REFRESH_TOKEN_COOKIE);
}

export function getAccessToken(): string | null {
  return readCookie(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken(): string | null {
  return readCookie(REFRESH_TOKEN_COOKIE);
}

/** Reads the exp claim without verifying the signature - fine here, this
 * is only used to decide whether it's worth trying to use the token this
 * browser already holds, not a security check. The backend (or, for
 * gated routes, the server-side verifier in ./verify.ts) is what actually
 * trusts or rejects it. */
function expiresWithin(token: string, marginSeconds: number): boolean {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: number;
    };
    if (!decoded.exp) return true;
    return Date.now() / 1000 >= decoded.exp - marginSeconds;
  } catch {
    return true;
  }
}

/**
 * Manual check-before-call, not an interceptor: this app's api-client
 * helpers already take an explicit token argument per call (see
 * lib/api-client/client.ts), so the natural fit is a function callers
 * await right before a request, matching that existing shape rather than
 * introducing a fetch-wrapping interceptor this codebase doesn't have yet.
 *
 * Returns null (and clears cookies) if there's no way to get a valid
 * token, so the caller can bounce to /login.
 */
export async function ensureValidAccessToken(): Promise<string | null> {
  const accessToken = getAccessToken();
  if (accessToken && !expiresWithin(accessToken, 30)) {
    return accessToken;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const newAccessToken = await refreshNative(refreshToken);
    setCookie(ACCESS_TOKEN_COOKIE, newAccessToken, ACCESS_TOKEN_TTL_SECONDS);
    return newAccessToken;
  } catch {
    clearTokens();
    return null;
  }
}

/** Best-effort revoke, then clears local state unconditionally - a failed
 * revoke call shouldn't leave the user stuck "logged in" in this browser. */
export async function signOutNative(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await logoutNative(refreshToken);
    } catch {
      // Best effort - clear local state either way.
    }
  }
  clearTokens();
}
