"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ScreenShell } from "@/components/composed/onboarding/ScreenShell";
import { Skeleton } from "@/components/ui/Skeleton";
import { WelcomeScreen } from "@/components/composed/onboarding/WelcomeScreen";
import { NameScreen } from "@/components/composed/onboarding/NameScreen";
import { EmailScreen } from "@/components/composed/onboarding/EmailScreen";
import { ContactDetailsScreen } from "@/components/composed/onboarding/ContactDetailsScreen";
import { LinksScreen } from "@/components/composed/onboarding/LinksScreen";
import { UploadScreen } from "@/components/composed/onboarding/UploadScreen";
import { WorkPreferenceScreen } from "@/components/composed/onboarding/WorkPreferenceScreen";
import { TargetRoleScreen } from "@/components/composed/onboarding/TargetRoleScreen";
import { SummaryScreen } from "@/components/composed/onboarding/SummaryScreen";
import {
  fetchMe,
  parseResume,
  saveProfile,
  type EducationEntry,
  type ProjectEntry,
  type WorkHistoryEntry,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { toFormFields } from "@/lib/resume";
import {
  RESUME_FILLABLE_FIELDS,
  type UploadState,
  type WorkPreferenceOption,
} from "@/lib/onboarding";
import type { FieldSourceKey, FieldSourceMap } from "@/lib/types";

// Resume first, so every screen after it can be answered by correcting a
// parsed value instead of typing from nothing.
const STEP_IDS = [
  "welcome",
  "resume",
  "name",
  "email",
  "contact",
  "links",
  "workPreference",
  "targetRole",
  "summary",
] as const;

type StepId = (typeof STEP_IDS)[number];

const TOTAL_STEPS = STEP_IDS.length;

// Named sections for the progress indicator, in the order they actually
// happen - resume comes before the contact fields on purpose (see the
// comment above STEP_IDS), so the phase list follows that, not the order
// someone might describe the flow in casual conversation.
const PHASES = ["Resume", "Contact", "Preferences", "Review"] as const;

// -1 means no phase has started yet - only true for welcome, which is an
// intro screen, not part of any section.
const STEP_PHASE_INDEX: Record<StepId, number> = {
  welcome: -1,
  resume: 0,
  name: 1,
  email: 1,
  contact: 1,
  links: 1,
  workPreference: 2,
  targetRole: 2,
  summary: 3,
};

const DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

interface FormState {
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
  workPreference: WorkPreferenceOption[];
  targetRoles: string[];
  fieldSource: FieldSourceMap;
}

const INITIAL_STATE: FormState = {
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
  workPreference: [],
  targetRoles: [],
  fieldSource: {},
};

// A field only flips to "manual" when its value actually changes - the name
// screen's onChange fires with both first and last name on every keystroke,
// even though only one of them moved.
function withManualSource<K extends FieldSourceKey>(
  prev: FormState,
  changes: Record<K, string>,
): FieldSourceMap {
  const next = { ...prev.fieldSource };
  for (const key of Object.keys(changes) as K[]) {
    if (changes[key] !== prev[key]) next[key] = "manual";
  }
  return next;
}

interface ResumeState {
  fileName: string | null;
  state: UploadState;
  error: string | null;
}

const INITIAL_RESUME: ResumeState = { fileName: null, state: "idle", error: null };

// Scoped per user, not global, so a shared machine can't resume one
// account's half-finished onboarding into a different account's session.
const DRAFT_KEY_PREFIX = "inroad-onboarding-draft:";

interface OnboardingDraft {
  form: FormState;
  stepIndex: number;
  resume: ResumeState;
}

function loadDraft(userId: string): OnboardingDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY_PREFIX + userId);
    return raw ? (JSON.parse(raw) as OnboardingDraft) : null;
  } catch {
    // Corrupted or inaccessible storage just means starting fresh, not a
    // broken flow.
    return null;
  }
}

function saveDraft(userId: string, draft: OnboardingDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY_PREFIX + userId, JSON.stringify(draft));
  } catch {
    // Full or blocked storage (private browsing) - best effort only.
  }
}

function clearDraft(userId: string): void {
  try {
    localStorage.removeItem(DRAFT_KEY_PREFIX + userId);
  } catch {
    // Same as above.
  }
}

export function OnboardingFlow() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  // True while the current screen was reached via an "Edit" tap from the
  // summary screen, rather than by walking the flow in order. Continue and
  // Back both return straight to summary in that case, instead of resuming
  // the normal step sequence from wherever this screen happens to sit in it.
  const [editingFromSummary, setEditingFromSummary] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [resume, setResume] = useState<ResumeState>(INITIAL_RESUME);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  // Guards the save effect below from firing before the restore attempt
  // finishes - otherwise the empty initial state would write over a real
  // draft the instant this component mounts.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    ensureValidAccessToken()
      .then((token) => (token ? fetchMe(token) : null))
      .then((user) => {
        if (cancelled || !user) return;
        setUserId(user.id);

        const draft = loadDraft(user.id);
        if (draft) {
          setForm(draft.form);
          setStepIndex(draft.stepIndex);
          // An interrupted upload has no file left to resume, only a
          // spinner with nothing behind it - only "done" or "error" are
          // meaningful to bring back.
          setResume(
            draft.resume.state === "done" || draft.resume.state === "error"
              ? draft.resume
              : INITIAL_RESUME,
          );
          return;
        }

        setForm((prev) =>
          prev.email ? prev : { ...prev, email: user.email, emailPrefilled: true },
        );
      })
      .catch(() => {
        // No prefill, no draft; the flow still works from scratch.
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !userId) return;
    saveDraft(userId, { form, stepIndex, resume });
  }, [hydrated, userId, form, stepIndex, resume]);

  const step = STEP_IDS[stepIndex];

  function goTo(id: StepId) {
    setStepIndex(STEP_IDS.indexOf(id));
  }

  function editFromSummary(id: StepId) {
    setEditingFromSummary(true);
    goTo(id);
  }

  function next() {
    if (editingFromSummary) {
      setEditingFromSummary(false);
      goTo("summary");
      return;
    }
    setStepIndex((index) => Math.min(index + 1, STEP_IDS.length - 1));
  }

  function back() {
    if (editingFromSummary) {
      setEditingFromSummary(false);
      goTo("summary");
      return;
    }
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  async function handleResumeSelect(file: File) {
    setResume({ fileName: file.name, state: "uploading", error: null });

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setResume({
          fileName: file.name,
          state: "error",
          error: "Your session expired. Sign in again to read your resume.",
        });
        return;
      }

      const parsed = await parseResume(file, token);
      const fields = toFormFields(parsed);

      setForm((prev) => {
        // "" means the parse didn't find that field, not that it did - only
        // overwrite a field the user may have already filled in by hand when
        // this parse actually found something for it, same rule the
        // fieldSource marking below already follows.
        const fieldSource = { ...prev.fieldSource };
        const resumeFields: Partial<Record<(typeof RESUME_FILLABLE_FIELDS)[number], string>> = {};
        for (const key of RESUME_FILLABLE_FIELDS) {
          if (fields[key]) {
            resumeFields[key] = fields[key];
            fieldSource[key] = "resume";
          }
        }
        // Email follows the same signed-in-beats-resume rule as the value
        // itself below, so it's only "resume" when the resume's address is
        // the one that actually won.
        if (!prev.emailPrefilled && fields.email) fieldSource.email = "resume";

        return {
          ...prev,
          ...resumeFields,
          // Not user-editable anywhere in this flow, so the latest parse
          // simply wins, there's no manual value to protect here.
          summary: fields.summary,
          skills: fields.skills,
          workHistory: fields.workHistory,
          education: fields.education,
          projects: fields.projects,
          // The signed-in address beats whatever the resume prints; that one is
          // confirmed and this one is a document that may be years old.
          email: prev.emailPrefilled ? prev.email : fields.email || prev.email,
          fieldSource,
        };
      });
      setResume({ fileName: file.name, state: "done", error: null });
    } catch (error) {
      setResume({
        fileName: file.name,
        state: "error",
        error:
          error instanceof Error
            ? error.message
            : "Could not read that file. You can fill the next few screens in yourself.",
      });
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setSubmitError("Your session expired. Sign in again to finish setup.");
        return;
      }

      await saveProfile(
        {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          location: form.location.trim() || null,
          linkedin_url: form.linkedinUrl.trim() || null,
          github_url: form.githubUrl.trim() || null,
          portfolio_url: form.portfolioUrl.trim() || null,
          // No onboarding screen asks for these two; they ride through from
          // the resume parse so a confirmed parse isn't dropped at save.
          summary: form.summary.trim(),
          skills: form.skills,
          work_history: form.workHistory,
          education: form.education,
          projects: form.projects,
          work_preference: form.workPreference,
          target_roles: form.targetRoles,
        },
        token,
      );
      if (userId) clearDraft(userId);
      router.push("/research");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong saving your profile.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const stepNumber = stepIndex + 1;
  const onBack = stepIndex > 0 ? back : undefined;

  return (
    <ScreenShell
      key={step}
      step={stepNumber}
      total={TOTAL_STEPS}
      phases={PHASES}
      currentPhaseIndex={STEP_PHASE_INDEX[step]}
      onBack={onBack}
    >
      {!hydrated ? (
        // A saved draft, if there is one, only shows up after fetchMe and
        // loadDraft resolve - rendering the real, interactive step before
        // then risks the draft landing on top of something the user just
        // typed and silently overwriting it.
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : (
        <>
          {step === "welcome" ? <WelcomeScreen phases={PHASES} onStart={next} /> : null}

          {step === "resume" ? (
            <UploadScreen
              heading="Start with your resume"
              helperText="PDF or DOCX. We read it, fill in what we can, and never keep the file."
              accept={DOCUMENT_ACCEPT}
              optional={false}
              fileName={resume.fileName}
              state={resume.state}
              progress={null}
              statusLabel="Reading your resume"
              errorMessage={resume.error}
              onSelect={handleResumeSelect}
              onRemove={() => setResume(INITIAL_RESUME)}
              onNext={next}
              // Only offered once a parse has actually failed. Skipping outright
              // isn't the point of this step; not being stuck on it is.
              onSkip={resume.state === "error" ? next : undefined}
              autoFocus
            />
          ) : null}

          {step === "name" ? (
            <NameScreen
              firstName={form.firstName}
              lastName={form.lastName}
              onChange={(firstName, lastName) =>
                setForm((prev) => ({
                  ...prev,
                  firstName,
                  lastName,
                  fieldSource: withManualSource(prev, { firstName, lastName }),
                }))
              }
              onNext={next}
            />
          ) : null}

          {step === "email" ? (
            <EmailScreen
              email={form.email}
              prefilled={form.emailPrefilled}
              onChange={(email) =>
                setForm((prev) => ({
                  ...prev,
                  email,
                  emailPrefilled: false,
                  fieldSource: withManualSource(prev, { email }),
                }))
              }
              onNext={next}
            />
          ) : null}

          {step === "contact" ? (
            <ContactDetailsScreen
              phone={form.phone}
              location={form.location}
              onChange={(phone, location) =>
                setForm((prev) => ({
                  ...prev,
                  phone,
                  location,
                  fieldSource: withManualSource(prev, { phone, location }),
                }))
              }
              onNext={next}
            />
          ) : null}

          {step === "links" ? (
            <LinksScreen
              links={{
                linkedinUrl: form.linkedinUrl,
                githubUrl: form.githubUrl,
                portfolioUrl: form.portfolioUrl,
              }}
              onChange={(links) =>
                setForm((prev) => ({
                  ...prev,
                  ...links,
                  fieldSource: withManualSource(prev, links),
                }))
              }
              onNext={next}
            />
          ) : null}

          {step === "workPreference" ? (
            <WorkPreferenceScreen
              selected={form.workPreference}
              onChange={(workPreference) => setForm((prev) => ({ ...prev, workPreference }))}
              onNext={next}
            />
          ) : null}

          {step === "targetRole" ? (
            <TargetRoleScreen
              targetRoles={form.targetRoles}
              onChange={(targetRoles) => setForm((prev) => ({ ...prev, targetRoles }))}
              onNext={next}
            />
          ) : null}

          {step === "summary" ? (
            <SummaryScreen
              firstName={form.firstName}
              lastName={form.lastName}
              email={form.email}
              phone={form.phone}
              location={form.location}
              linkedinUrl={form.linkedinUrl}
              githubUrl={form.githubUrl}
              portfolioUrl={form.portfolioUrl}
              skills={form.skills}
              resumeFileName={resume.state === "done" ? resume.fileName : null}
              workPreference={form.workPreference}
              targetRoles={form.targetRoles}
              fieldSource={form.fieldSource}
              onEditName={() => editFromSummary("name")}
              onEditEmail={() => editFromSummary("email")}
              onEditPhone={() => editFromSummary("contact")}
              onEditLocation={() => editFromSummary("contact")}
              onEditLinks={() => editFromSummary("links")}
              onEditResume={() => editFromSummary("resume")}
              onEditWorkPreference={() => editFromSummary("workPreference")}
              onEditTargetRole={() => editFromSummary("targetRole")}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitError={submitError}
            />
          ) : null}
        </>
      )}
    </ScreenShell>
  );
}
