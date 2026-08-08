/**
 * Server-side Supabase client, for Server Components, Route Handlers and
 * Server Actions. Reads/writes auth cookies via next/headers, per the SSR
 * helpers' recommended pattern.
 *
 * Stub: no auth calls are wired to this yet. The initialization itself is
 * real - swap in real Supabase project credentials and it works. Call
 * `createClient()` fresh per request; the client is not meant to be reused
 * across requests.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, which can't set cookies.
            // Fine as long as middleware refreshes the session instead.
          }
        },
      },
    },
  );
}
