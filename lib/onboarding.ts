/** Onboarding form types and validation. The write goes through saveProfile
 * in lib/api-client/client.ts, same as settings. */

import type { FieldSourceKey } from "@/lib/types";

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

export function workPreferenceLabels(values: readonly WorkPreferenceOption[]): string[] {
  return values.map(
    (value) => WORK_PREFERENCE_OPTIONS.find((option) => option.value === value)?.label ?? value,
  );
}

export type UploadState = "idle" | "uploading" | "done" | "error";

export interface ProfileLinks {
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

export const LINK_FIELDS: { key: keyof ProfileLinks; label: string; placeholder: string }[] = [
  { key: "linkedinUrl", label: "LinkedIn", placeholder: "https://linkedin.com/in/you" },
  { key: "githubUrl", label: "GitHub", placeholder: "https://github.com/you" },
  { key: "portfolioUrl", label: "Portfolio or site", placeholder: "https://yoursite.com" },
];

// Platform names, not raw URLs: three full links on one line truncate into
// an unreadable ellipsis.
export function linkLabels(links: ProfileLinks): string[] {
  return LINK_FIELDS.filter((field) => links[field.key]).map((field) =>
    field.key === "portfolioUrl" ? "Portfolio" : field.label,
  );
}

export interface ValueProp {
  title: string;
  description: string;
}

export const VALUE_PROPS: ValueProp[] = [
  {
    title: "Real matches",
    description:
      "Companies that actually fit what you're looking for, not a keyword-matched board.",
  },
  {
    title: "Real research",
    description:
      "Funding, team, and tech stack pulled together into something worth reading first.",
  },
  {
    title: "Real outreach",
    description: "A drafted message to someone who can actually hire you, not a form letter.",
  },
];

// The FieldSourceKeys a resume parse can actually fill - summary/skills/
// workHistory/education/projects ride through separately and never get a
// "from resume" badge of their own, so they're deliberately excluded here.
export const RESUME_FILLABLE_FIELDS: readonly FieldSourceKey[] = [
  "firstName",
  "lastName",
  "phone",
  "location",
  "linkedinUrl",
  "githubUrl",
  "portfolioUrl",
];

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
