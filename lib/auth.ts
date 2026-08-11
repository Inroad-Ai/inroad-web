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
): Promise<"/onboarding" | "/research"> {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? "/research" : "/onboarding";
}
