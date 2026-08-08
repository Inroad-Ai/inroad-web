/**
 * Client-side Supabase client. Safe to import from any "use client" component.
 *
 * Stub: no auth calls are wired to this yet (see lib/supabase/server.ts and
 * app/core equivalent on the backend, core/auth.py). The initialization
 * itself is real - swap in real Supabase project credentials and it works.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
