import type {
  CertificateEntry,
  EducationEntry,
  LanguageEntry,
  Profile,
  ProfileUpsert,
  ProjectEntry,
  WorkHistoryEntry,
} from "@/lib/api-client/client";
import { regionsToSave, type RegionOption, type WorkPreferenceOption } from "@/lib/onboarding";
import {
  validateEmail,
  validateLocation,
  validateName,
  validatePhone,
  validateUrl,
} from "@/lib/onboarding-schema";
import { toUpsert } from "@/lib/profile";

export interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  xUrl: string;
  summary: string;
  skills: string[];
  workHistory: WorkHistoryEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certificates: CertificateEntry[];
  languages: LanguageEntry[];
  workPreference: WorkPreferenceOption[];
  regions: RegionOption[];
  targetRoles: string[];
}

export type ValidatedField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "location"
  | "linkedinUrl"
  | "githubUrl"
  | "portfolioUrl"
  | "xUrl"
  | "workPreference"
  | "targetRoles";

export type ValidationErrors = Partial<Record<ValidatedField, string>>;

export type UpdateField = <K extends keyof FormState>(key: K, value: FormState[K]) => void;

export function validateProfile(form: FormState): ValidationErrors {
  const checks: Record<ValidatedField, string | null> = {
    firstName: validateName(form.firstName),
    lastName: validateName(form.lastName),
    email: validateEmail(form.email),
    phone: validatePhone(form.phone),
    location: validateLocation(form.location),
    linkedinUrl: validateUrl(form.linkedinUrl),
    githubUrl: validateUrl(form.githubUrl),
    portfolioUrl: validateUrl(form.portfolioUrl),
    xUrl: validateUrl(form.xUrl),
    workPreference: form.workPreference.length ? null : "Pick at least one.",
    targetRoles: form.targetRoles.length ? null : "Add at least one role.",
  };

  return Object.fromEntries(
    Object.entries(checks).filter((entry): entry is [ValidatedField, string] => Boolean(entry[1])),
  );
}

export function toFormState(profile: Profile): FormState {
  return {
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location ?? "",
    linkedinUrl: profile.linkedin_url ?? "",
    githubUrl: profile.github_url ?? "",
    portfolioUrl: profile.portfolio_url ?? "",
    xUrl: profile.x_url ?? "",
    summary: profile.summary ?? "",
    // Optional in the generated type because the server defaults them, so
    // they are absent rather than empty on a profile with no parse.
    skills: profile.skills ?? [],
    workHistory: profile.work_history ?? [],
    education: profile.education ?? [],
    projects: profile.projects ?? [],
    certificates: profile.certificates ?? [],
    languages: profile.languages ?? [],
    workPreference: profile.work_preference,
    regions: profile.regions ?? [],
    targetRoles: profile.target_roles,
  };
}

/** Empty means "not set" on the way out. Sending "" would store a blank
 * string that reads as a real value everywhere downstream. */
function orNull(value: string): string | null {
  return value.trim() || null;
}

function withoutBlanks<T extends object>(entries: T[]): T[] {
  return entries.filter((entry) =>
    Object.values(entry).some((value) => typeof value === "string" && value.trim()),
  );
}

export function toProfileUpsert(profile: Profile, form: FormState): ProfileUpsert {
  return toUpsert(profile, {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    location: orNull(form.location),
    linkedin_url: orNull(form.linkedinUrl),
    github_url: orNull(form.githubUrl),
    portfolio_url: orNull(form.portfolioUrl),
    x_url: orNull(form.xUrl),
    summary: form.summary.trim(),
    skills: form.skills,
    work_history: withoutBlanks(form.workHistory),
    education: withoutBlanks(form.education),
    projects: withoutBlanks(form.projects),
    certificates: withoutBlanks(form.certificates),
    languages: withoutBlanks(form.languages),
    work_preference: form.workPreference,
    regions: regionsToSave(form.workPreference, form.regions),
    target_roles: form.targetRoles,
  });
}

export function completionPercent(form: FormState): number {
  const checks = [
    form.firstName.trim(),
    form.lastName.trim(),
    form.email.trim(),
    form.phone.trim(),
    form.location.trim(),
    form.targetRoles.length,
    form.workPreference.length,
    form.summary.trim(),
    form.skills.length,
    form.workHistory.length,
    form.education.length,
    form.linkedinUrl || form.githubUrl || form.portfolioUrl || form.xUrl,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function hasResumeData(form: FormState): boolean {
  return Boolean(
    form.summary.trim() ||
    form.skills.length ||
    form.workHistory.length ||
    form.education.length ||
    form.projects.length ||
    form.certificates.length ||
    form.languages.length,
  );
}
