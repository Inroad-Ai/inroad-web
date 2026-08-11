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
  return data ? "/overview" : "/onboarding";
}
