/** Onboarding reads and writes. Straight to Supabase for the same reason as
 * lib/profile.ts: no backend route, RLS does the scoping. */

import type { SupabaseClient } from "@supabase/supabase-js";

export type WorkPreferenceOption = "remote" | "hybrid" | "onsite" | "relocation";

export const WORK_PREFERENCE_OPTIONS: { value: WorkPreferenceOption; label: string }[] = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Onsite" },
  { value: "relocation", label: "Open to relocation" },
];

export type UploadState = "idle" | "uploading" | "done" | "error";

export interface OnboardingSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeStoragePath: string;
  careerArcStoragePath: string | null;
  workPreference: WorkPreferenceOption[];
  targetRoles: string[];
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Permissive on purpose - accepts spaces, dashes, parens, an optional leading +. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[^0-9]/g, "");
  return digits.length >= 7 && digits.length <= 15 && /^[0-9+()\-.\s]+$/.test(value.trim());
}

function uploadWithProgress(
  url: string,
  file: File,
  headers: Record<string, string>,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`Upload failed (${xhr.status}). Try again.`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));

    xhr.send(file);
  });
}

/**
 * Uploads a file to a private, user-scoped path in the given bucket, using a
 * plain XHR against Supabase Storage's REST endpoint instead of storage-js -
 * that's what gets us real upload-progress events.
 */
export async function uploadOnboardingFile(params: {
  supabase: SupabaseClient;
  bucket: "resumes" | "career-arc-documents";
  userId: string;
  file: File;
  onProgress: (percent: number) => void;
}): Promise<string> {
  const { supabase, bucket, userId, file, onProgress } = params;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("You need to be signed in to upload a file.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase is not configured for this environment.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${userId}/${Date.now()}-${safeName}`;
  const url = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${path}`;

  await uploadWithProgress(
    url,
    file,
    {
      Authorization: `Bearer ${session.access_token}`,
      apikey: anonKey,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    onProgress,
  );

  return path;
}

/**
 * Writes the finished profile row. Uses upsert on user_id so a retry after a
 * failed submit doesn't collide with a partial row from a previous attempt.
 */
export async function submitOnboardingProfile(
  supabase: SupabaseClient,
  userId: string,
  data: OnboardingSubmission,
): Promise<void> {
  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: userId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      resume_storage_path: data.resumeStoragePath,
      career_arc_storage_path: data.careerArcStoragePath,
      work_preference: data.workPreference,
      target_roles: data.targetRoles,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}
