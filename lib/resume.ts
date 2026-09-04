/** Turning a parse result into onboarding form values. Pure: the call itself
 * is parseResume in lib/api-client/client.ts. */

import type {
  CertificateEntry,
  EducationEntry,
  LanguageEntry,
  ProjectEntry,
  ResumeParseResult,
  WorkHistoryEntry,
} from "@/lib/api-client/client";

export interface ParsedFields {
  firstName: string;
  lastName: string;
  email: string;
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
}

/** Everything the parse can omit lands as "", which is what an unanswered
 * onboarding field already looks like, so a missing field just gets asked
 * for normally instead of needing its own "was this parsed?" flag. */
export function toFormFields(parsed: ResumeParseResult): ParsedFields {
  const [firstName, lastName] = splitName(parsed.full_name ?? "");

  return {
    firstName,
    lastName,
    email: parsed.email ?? "",
    phone: parsed.phone ?? "",
    location: parsed.location ?? "",
    linkedinUrl: parsed.linkedin_url ?? "",
    githubUrl: parsed.github_url ?? "",
    portfolioUrl: parsed.portfolio_url ?? "",
    summary: parsed.summary ?? "",
    skills: parsed.skills ?? [],
    workHistory: parsed.work_history ?? [],
    education: parsed.education ?? [],
    projects: parsed.projects ?? [],
    certificates: parsed.certificates ?? [],
    languages: parsed.languages ?? [],
  };
}

/** Last word is the surname, the rest is the given name. Wrong for some
 * naming conventions, which is why the name screen still shows both fields
 * filled in and editable rather than treating this as settled. */
function splitName(fullName: string): [string, string] {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ["", ""];
  if (parts.length === 1) return [parts[0], ""];
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}
