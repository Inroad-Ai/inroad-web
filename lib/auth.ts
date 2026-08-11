/**
 * Where a signed-in user should land, once. Used right after password
 * sign-in, right after Google OAuth exchanges its code, and right after an
 * email confirmation link resolves - anywhere we've just established a
 * session and need to decide onboarding vs dashboard.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export async function resolvePostAuthPath(
  supabase: SupabaseClient,
  userId: string,
): Promise<"/onboarding" | "/overview"> {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  // Overview, not Research: a returning user wants a snapshot of where
  // their search stands before deciding what to do next, not a blank
  // research form every time they sign in.
  return data ? "/overview" : "/onboarding";
}
