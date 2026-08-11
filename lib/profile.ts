/**
 * Types and Supabase calls for the settings page. Same table, same RLS
 * policies as onboarding (lib/onboarding.ts) - reads and writes go straight
 * to Supabase, not through the FastAPI client, because there is no backend
 * route for profile data.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { WorkPreferenceOption } from "./onboarding";

export interface ProfileRow {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  resume_storage_path: string | null;
  career_arc_storage_path: string | null;
  work_preference: WorkPreferenceOption[];
  target_roles: string[];
}

export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "first_name, last_name, email, phone, resume_storage_path, career_arc_storage_path, work_preference, target_roles",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as ProfileRow | null;
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  fields: Partial<ProfileRow>,
): Promise<void> {
  const { error } = await supabase.from("profiles").update(fields).eq("user_id", userId);
  if (error) throw new Error(error.message);
}

/** A stored path looks like `{userId}/{timestamp}-{original name}`. Show just the name. */
export function fileNameFromPath(path: string | null): string | null {
  if (!path) return null;
  const segment = path.split("/").pop() ?? path;
  return segment.replace(/^\d+-/, "");
}

/** Short-lived URL to view/download a private storage object. */
export async function getSignedFileUrl(
  supabase: SupabaseClient,
  bucket: "resumes" | "career-arc-documents",
  path: string,
): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60);
  if (error || !data) throw new Error(error?.message ?? "Could not create a download link.");
  return data.signedUrl;
}
