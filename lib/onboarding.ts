/** Onboarding form types and validation. The write goes through saveProfile
 * in lib/api-client/client.ts, same as settings. */

export type WorkPreferenceOption = "remote" | "hybrid" | "onsite" | "relocation";

export const WORK_PREFERENCE_OPTIONS: { value: WorkPreferenceOption; label: string }[] = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Onsite" },
  { value: "relocation", label: "Open to relocation" },
];

export type UploadState = "idle" | "uploading" | "done" | "error";

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Permissive on purpose - accepts spaces, dashes, parens, an optional leading +. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[^0-9]/g, "");
  return digits.length >= 7 && digits.length <= 15 && /^[0-9+()\-.\s]+$/.test(value.trim());
}
