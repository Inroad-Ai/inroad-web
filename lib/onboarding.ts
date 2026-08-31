/** Onboarding form types and validation. The write goes through saveProfile
 * in lib/api-client/client.ts, same as settings. */

export type WorkPreferenceOption = "remote" | "hybrid" | "onsite" | "relocation";

export const WORK_PREFERENCE_OPTIONS: {
  value: WorkPreferenceOption;
  label: string;
  description: string;
}[] = [
  { value: "remote", label: "Remote", description: "Work from anywhere, no office required." },
  { value: "hybrid", label: "Hybrid", description: "Split time between home and an office." },
  { value: "onsite", label: "Onsite", description: "Based at a company's office full-time." },
  {
    value: "relocation",
    label: "Open to relocation",
    description: "Willing to move for the right opportunity.",
  },
];

export type UploadState = "idle" | "uploading" | "done" | "error";

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// A starting point for the target-role picker, not the full list - anything
// not here is still just a type-and-Enter away in that screen's tag input.
export const COMMON_TARGET_ROLES = [
  "Software Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Engineer",
  "Mobile Engineer",
  "DevOps Engineer",
  "Data Engineer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "Product Manager",
  "UX/UI Designer",
  "QA Engineer",
] as const;
