"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CertificatesEditor } from "@/components/composed/profile/CertificatesEditor";
import { ContactLocationEditor } from "@/components/composed/profile/ContactLocationEditor";
import { EducationEditor } from "@/components/composed/profile/EducationEditor";
import { LanguagesEditor } from "@/components/composed/profile/LanguagesEditor";
import { ProjectsEditor } from "@/components/composed/profile/ProjectsEditor";
import { ResumeManager } from "@/components/composed/profile/ResumeManager";
import { WorkHistoryEditor } from "@/components/composed/profile/WorkHistoryEditor";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { TagInput } from "@/components/ui/TagInput";
import { Textarea } from "@/components/ui/Textarea";
import { UrlInput } from "@/components/ui/UrlInput";
import { useProfile } from "@/hooks/useProfile";
import {
  saveProfile,
  type CertificateEntry,
  type EducationEntry,
  type LanguageEntry,
  type Profile,
  type ProjectEntry,
  type WorkHistoryEntry,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { WORK_PREFERENCE_OPTIONS, type WorkPreferenceOption } from "@/lib/onboarding";
import {
  validateEmail,
  validateLocation,
  validateName,
  validatePhone,
  validateUrl,
} from "@/lib/onboarding-schema";
import { CAREER_ARC_PARSING_UNAVAILABLE, toUpsert } from "@/lib/profile";
import type { ParsedFields } from "@/lib/resume";

interface FormState {
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
  targetRoles: string[];
}

type ValidatedField =
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

type ValidationErrors = Partial<Record<ValidatedField, string>>;

function validateProfile(form: FormState): ValidationErrors {
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

function toFormState(profile: Profile): FormState {
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

export function ProfileForm() {
  const { profile, setProfile, loading, error } = useProfile();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (profile) setForm(toFormState(profile));
  }, [profile]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setValidationErrors((previous) => {
      const next = { ...previous };
      delete next[key as ValidatedField];
      return next;
    });
    setSaveError(null);
    setSaved(false);
  }

  function toggleWorkPreference(option: WorkPreferenceOption) {
    if (!form) return;
    update(
      "workPreference",
      form.workPreference.includes(option)
        ? form.workPreference.filter((value) => value !== option)
        : [...form.workPreference, option],
    );
  }

  function applyParsedResume(fields: ParsedFields) {
    setForm((previous) =>
      previous
        ? {
            ...previous,
            firstName: fields.firstName || previous.firstName,
            lastName: fields.lastName || previous.lastName,
            phone: fields.phone || previous.phone,
            location: fields.location || previous.location,
            linkedinUrl: fields.linkedinUrl || previous.linkedinUrl,
            githubUrl: fields.githubUrl || previous.githubUrl,
            portfolioUrl: fields.portfolioUrl || previous.portfolioUrl,
            summary: fields.summary || previous.summary,
            skills: fields.skills.length ? fields.skills : previous.skills,
            workHistory: fields.workHistory.length ? fields.workHistory : previous.workHistory,
            education: fields.education.length ? fields.education : previous.education,
            projects: fields.projects.length ? fields.projects : previous.projects,
            certificates: fields.certificates.length ? fields.certificates : previous.certificates,
            languages: fields.languages.length ? fields.languages : previous.languages,
          }
        : previous,
    );
    setSaved(false);
    setSaveError(null);
  }

  function applyDeletedResume() {
    setForm((previous) =>
      previous
        ? {
            ...previous,
            summary: "",
            skills: [],
            workHistory: [],
            education: [],
            projects: [],
            certificates: [],
            languages: [],
          }
        : previous,
    );
    setSaved(false);
    setSaveError(null);
  }

  async function handleSave() {
    if (!profile || !form) return;

    const errors = validateProfile(form);
    setValidationErrors(errors);
    if (Object.keys(errors).length) {
      setSaveError("Review the highlighted fields before saving.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setSaveError("Your session expired. Sign in again.");
        return;
      }

      const updated = await saveProfile(
        toUpsert(profile, {
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
          target_roles: form.targetRoles,
        }),
        token,
      );
      setForm(toFormState(updated));
      setProfile(updated);
      setSaved(true);
    } catch (caught) {
      setSaveError(caught instanceof Error ? caught.message : "Could not save your changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div role="status" className="mt-6 max-w-5xl space-y-6" aria-label="Loading your profile">
        <div className="rounded-md border border-line bg-surface p-6 shadow-card">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-md" />
          <Skeleton className="h-80 rounded-md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 max-w-5xl rounded-md border border-error/30 bg-error-subtle p-5 text-sm text-error">
        {error}
      </div>
    );
  }

  if (!profile || !form) {
    return (
      <p className="max-w-3xl text-sm text-text-secondary">
        You haven&apos;t finished setup yet.{" "}
        <Link href="/onboarding" className="text-signal-teal underline underline-offset-4">
          Complete onboarding
        </Link>{" "}
        to see your profile here.
      </p>
    );
  }

  const initials = `${form.firstName.slice(0, 1)}${form.lastName.slice(0, 1)}`.toUpperCase();
  const completionChecks = [
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
  const completion = Math.round(
    (completionChecks.filter(Boolean).length / completionChecks.length) * 100,
  );
  const hasResume = Boolean(
    form.summary.trim() ||
    form.skills.length ||
    form.workHistory.length ||
    form.education.length ||
    form.projects.length ||
    form.certificates.length ||
    form.languages.length,
  );

  return (
    <div className="mt-6 max-w-5xl space-y-6">
      <section className="rounded-md border border-line bg-surface px-6 py-5 shadow-card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-signal-teal-subtle font-display text-sm font-semibold text-signal-teal">
              {initials || "?"}
            </div>
            <div>
              <p className="utility-label text-signal-teal">Candidate profile</p>
              <h2 className="mt-1 font-display text-xl font-semibold text-text-primary sm:text-2xl">
                {form.firstName || "Your"} {form.lastName || "profile"}
              </h2>
              <p className="mt-1 text-xs text-text-secondary">{form.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-line overflow-hidden rounded-sm border border-line bg-surface-raised text-center lg:min-w-80">
            <div className="px-5 py-2.5">
              <p className="font-display text-base font-semibold text-text-primary">
                {form.targetRoles.length}
              </p>
              <p className="utility-label mt-1 text-text-secondary">Roles</p>
            </div>
            <div className="px-5 py-2.5">
              <p className="font-display text-base font-semibold text-text-primary">
                {form.skills.length}
              </p>
              <p className="utility-label mt-1 text-text-secondary">Skills</p>
            </div>
            <div className="px-5 py-2.5">
              <p className="font-display text-base font-semibold text-text-primary">
                {form.workHistory.length}
              </p>
              <p className="utility-label mt-1 text-text-secondary">Experience</p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-secondary">
            Your profile shapes company matching, research, and the outreach drafts prepared in
            Inroad.
          </p>
          <span className="utility-label whitespace-nowrap text-signal-teal">
            {completion}% complete
          </span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-raised">
          <div
            className="h-full rounded-full bg-signal-teal transition-[width] duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Personal details"
          meta={<span className="text-xs text-text-secondary">Required</span>}
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                htmlFor="profile-first-name"
                error={validationErrors.firstName}
                errorId="profile-first-name-error"
              >
                <Input
                  id="profile-first-name"
                  aria-invalid={validationErrors.firstName ? true : undefined}
                  aria-describedby={
                    validationErrors.firstName ? "profile-first-name-error" : undefined
                  }
                  value={form.firstName}
                  onChange={(event) => update("firstName", event.target.value)}
                />
              </Field>
              <Field
                label="Last name"
                htmlFor="profile-last-name"
                error={validationErrors.lastName}
                errorId="profile-last-name-error"
              >
                <Input
                  id="profile-last-name"
                  aria-invalid={validationErrors.lastName ? true : undefined}
                  aria-describedby={
                    validationErrors.lastName ? "profile-last-name-error" : undefined
                  }
                  value={form.lastName}
                  onChange={(event) => update("lastName", event.target.value)}
                />
              </Field>
            </div>
            <Field
              label="Email"
              hint="Use the same contact email you confirmed in onboarding."
              htmlFor="profile-email"
              error={validationErrors.email}
              errorId="profile-email-error"
            >
              <Input
                id="profile-email"
                type="email"
                aria-invalid={validationErrors.email ? true : undefined}
                aria-describedby={validationErrors.email ? "profile-email-error" : undefined}
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="you@example.com"
              />
            </Field>
            <ContactLocationEditor
              location={form.location}
              phone={form.phone}
              locationError={validationErrors.location}
              phoneError={validationErrors.phone}
              onLocationChange={(location) => update("location", location)}
              onPhoneChange={(phone) => update("phone", phone)}
            />
          </div>
        </Section>

        <Section
          title="Online presence"
          meta={<span className="text-xs text-text-secondary">Optional</span>}
        >
          <div className="space-y-4">
            <Field
              label="LinkedIn"
              htmlFor="profile-linkedin"
              error={validationErrors.linkedinUrl}
              errorId="profile-linkedin-error"
            >
              <UrlInput
                id="profile-linkedin"
                aria-invalid={validationErrors.linkedinUrl ? true : undefined}
                aria-describedby={
                  validationErrors.linkedinUrl ? "profile-linkedin-error" : undefined
                }
                value={form.linkedinUrl}
                onChange={(event) => update("linkedinUrl", event.target.value)}
                placeholder="https://linkedin.com/in/you"
              />
            </Field>
            <Field
              label="GitHub"
              htmlFor="profile-github"
              error={validationErrors.githubUrl}
              errorId="profile-github-error"
            >
              <UrlInput
                id="profile-github"
                aria-invalid={validationErrors.githubUrl ? true : undefined}
                aria-describedby={validationErrors.githubUrl ? "profile-github-error" : undefined}
                value={form.githubUrl}
                onChange={(event) => update("githubUrl", event.target.value)}
                placeholder="https://github.com/you"
              />
            </Field>
            <Field
              label="Portfolio or site"
              htmlFor="profile-portfolio"
              error={validationErrors.portfolioUrl}
              errorId="profile-portfolio-error"
            >
              <UrlInput
                id="profile-portfolio"
                aria-invalid={validationErrors.portfolioUrl ? true : undefined}
                aria-describedby={
                  validationErrors.portfolioUrl ? "profile-portfolio-error" : undefined
                }
                value={form.portfolioUrl}
                onChange={(event) => update("portfolioUrl", event.target.value)}
                placeholder="https://yoursite.com"
              />
            </Field>
            <Field
              label="X profile"
              htmlFor="profile-x"
              error={validationErrors.xUrl}
              errorId="profile-x-error"
            >
              <UrlInput
                id="profile-x"
                aria-invalid={validationErrors.xUrl ? true : undefined}
                aria-describedby={validationErrors.xUrl ? "profile-x-error" : undefined}
                value={form.xUrl}
                onChange={(event) => update("xUrl", event.target.value)}
                placeholder="https://x.com/you"
              />
            </Field>
          </div>
        </Section>
      </div>

      <Section
        title="Resume"
        meta={<span className="text-xs text-text-secondary">PDF or DOCX</span>}
      >
        <ResumeManager
          hasResume={hasResume}
          roleCount={form.workHistory.length}
          skillCount={form.skills.length}
          onParsed={applyParsedResume}
          onDeleted={applyDeletedResume}
        />
      </Section>

      <Section
        title="Career arc document"
        meta={<span className="text-xs text-text-secondary">Optional</span>}
      >
        <div className="flex flex-col gap-3 rounded-sm border border-line bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-sm font-semibold text-text-primary">
              {profile.career_arc_parsed_json ? "Career arc added" : "No career arc added"}
            </p>
            <p className="mt-1 text-xs text-text-secondary">{CAREER_ARC_PARSING_UNAVAILABLE}</p>
          </div>
          <span className="utility-label shrink-0 text-text-secondary">
            {profile.career_arc_parsed_json ? "Parsed" : "Not added"}
          </span>
        </div>
      </Section>

      <Section
        title="Search preferences"
        meta={<span className="text-xs text-text-secondary">Used for matching</span>}
      >
        <div className="space-y-6">
          <Field
            label="Target roles"
            hint="Add the roles you would genuinely consider next."
            error={validationErrors.targetRoles}
          >
            <TagInput
              value={form.targetRoles}
              onChange={(targetRoles) => update("targetRoles", targetRoles)}
              placeholder="Founding engineer, backend engineer, ..."
            />
          </Field>
          <div>
            <span className="utility-label text-text-secondary">Work preference</span>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {WORK_PREFERENCE_OPTIONS.map((option) => (
                <SelectableCard
                  key={option.value}
                  compact
                  selected={form.workPreference.includes(option.value)}
                  onClick={() => toggleWorkPreference(option.value)}
                >
                  {form.workPreference.includes(option.value) ? "✓ " : ""}
                  {option.label}
                </SelectableCard>
              ))}
            </div>
            {validationErrors.workPreference ? (
              <p className="mt-2 text-xs text-error" aria-live="polite">
                {validationErrors.workPreference}
              </p>
            ) : null}
          </div>
        </div>
      </Section>

      <Section
        title="Professional story"
        meta={<span className="text-xs text-text-secondary">Used for outreach</span>}
      >
        <div className="space-y-6">
          <Field
            label="Summary"
            hint="A concise introduction helps personalize your research and outreach."
          >
            <Textarea
              rows={6}
              value={form.summary}
              onChange={(event) => update("summary", event.target.value)}
              placeholder="A couple of lines on what you do."
            />
          </Field>
          <Field label="Skills" hint="Use specific tools, methods, and areas of expertise.">
            <TagInput
              value={form.skills}
              onChange={(skills) => update("skills", skills)}
              placeholder="Python, PostgreSQL, ..."
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Experience"
        meta={<span className="text-xs text-text-secondary">{form.workHistory.length} roles</span>}
      >
        <WorkHistoryEditor
          entries={form.workHistory}
          onChange={(workHistory) => update("workHistory", workHistory)}
        />
      </Section>

      <Section
        title="Projects"
        meta={<span className="text-xs text-text-secondary">{form.projects.length} projects</span>}
      >
        <ProjectsEditor
          entries={form.projects}
          onChange={(projects) => update("projects", projects)}
        />
      </Section>

      <Section
        title="Education"
        meta={<span className="text-xs text-text-secondary">{form.education.length} entries</span>}
      >
        <EducationEditor
          entries={form.education}
          onChange={(education) => update("education", education)}
        />
      </Section>

      <Section
        title="Certificates & achievements"
        meta={
          <span className="text-xs text-text-secondary">
            {form.certificates.length}{" "}
            {form.certificates.length === 1 ? "certificate" : "certificates"}
          </span>
        }
      >
        <CertificatesEditor
          entries={form.certificates}
          onChange={(certificates) => update("certificates", certificates)}
        />
      </Section>

      <Section
        title="Languages"
        meta={
          <span className="text-xs text-text-secondary">
            {form.languages.length} {form.languages.length === 1 ? "language" : "languages"}
          </span>
        }
      >
        <LanguagesEditor
          entries={form.languages}
          onChange={(languages) => update("languages", languages)}
        />
      </Section>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-md border border-line bg-surface/95 p-4 shadow-overlay backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          {saved ? <span className="text-success">Your profile is up to date.</span> : null}
          {saveError ? <span className="text-error">{saveError}</span> : null}
          {!saved && !saveError ? (
            <span className="text-text-secondary">
              Save changes to update your matching profile.
            </span>
          ) : null}
        </p>
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </div>
  );
}
