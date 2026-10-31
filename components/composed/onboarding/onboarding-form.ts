import type {
  CertificateEntry,
  EducationEntry,
  LanguageEntry,
  ProfileUpsert,
  ProjectEntry,
  WorkHistoryEntry,
} from "@/lib/api-client/client";
import {
  RESUME_FILLABLE_FIELDS,
  type UploadState,
  regionsToSave,
  type RegionOption,
  type WorkPreferenceOption,
} from "@/lib/onboarding";
import type { ParsedFields } from "@/lib/resume";
import type { FieldSourceKey, FieldSourceMap } from "@/lib/types";

export interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  emailPrefilled: boolean;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
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
  fieldSource: FieldSourceMap;
}

export const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  emailPrefilled: false,
  phone: "",
  location: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  summary: "",
  skills: [],
  workHistory: [],
  education: [],
  projects: [],
  certificates: [],
  languages: [],
  workPreference: [],
  regions: [],
  targetRoles: [],
  fieldSource: {},
};

export interface ResumeState {
  fileName: string | null;
  fileSize: number | null;
  state: UploadState;
  error: string | null;
}

export const INITIAL_RESUME: ResumeState = {
  fileName: null,
  fileSize: null,
  state: "idle",
  error: null,
};

// A field only flips to "manual" when its value actually changes: the name
// screen's onChange fires with both first and last name on every keystroke.
export function withManualSource<K extends FieldSourceKey>(
  prev: FormState,
  changes: Record<K, string>,
): FieldSourceMap {
  const next = { ...prev.fieldSource };
  for (const key of Object.keys(changes) as K[]) {
    if (changes[key] !== prev[key]) next[key] = "manual";
  }
  return next;
}

/** Folds a resume parse into the form without clobbering what the user typed. */
export function applyResumeFields(prev: FormState, fields: ParsedFields): FormState {
  // "" means the parse didn't find that field, so only a found value
  // overwrites one the user may have filled in by hand.
  const fieldSource = { ...prev.fieldSource };
  const resumeFields: Partial<Record<(typeof RESUME_FILLABLE_FIELDS)[number], string>> = {};
  for (const key of RESUME_FILLABLE_FIELDS) {
    if (fields[key]) {
      resumeFields[key] = fields[key];
      fieldSource[key] = "resume";
    }
  }
  // Email is only "resume" when the resume's address is the one that won below.
  if (!prev.emailPrefilled && fields.email) fieldSource.email = "resume";

  return {
    ...prev,
    ...resumeFields,
    // Not editable anywhere in this flow, so the latest parse simply wins.
    summary: fields.summary,
    skills: fields.skills,
    workHistory: fields.workHistory,
    education: fields.education,
    projects: fields.projects,
    certificates: fields.certificates,
    languages: fields.languages,
    // The signed-in address beats whatever the resume prints; that one is
    // confirmed and this one is a document that may be years old.
    email: prev.emailPrefilled ? prev.email : fields.email || prev.email,
    fieldSource,
  };
}

export function toProfileUpsert(form: FormState): ProfileUpsert {
  return {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    location: form.location.trim() || null,
    linkedin_url: form.linkedinUrl.trim() || null,
    github_url: form.githubUrl.trim() || null,
    portfolio_url: form.portfolioUrl.trim() || null,
    // No onboarding screen asks for these; they ride through from the resume
    // parse so a confirmed parse isn't dropped at save.
    summary: form.summary.trim(),
    skills: form.skills,
    work_history: form.workHistory,
    education: form.education,
    projects: form.projects,
    certificates: form.certificates,
    languages: form.languages,
    work_preference: form.workPreference,
    regions: regionsToSave(form.workPreference, form.regions),
    target_roles: form.targetRoles,
  };
}
