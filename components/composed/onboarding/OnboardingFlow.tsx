"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ScreenShell } from "@/components/composed/onboarding/ScreenShell";
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
import { CAREER_ARC_PARSING_UNAVAILABLE } from "@/lib/profile";
import { toFormFields } from "@/lib/resume";
import { type UploadState, type WorkPreferenceOption } from "@/lib/onboarding";
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
  "careerArc",
  "workPreference",
  "targetRole",
  "summary",
] as const;

type StepId = (typeof STEP_IDS)[number];

const TOTAL_STEPS = STEP_IDS.length;

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

export function OnboardingFlow() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [resume, setResume] = useState<ResumeState>(INITIAL_RESUME);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    ensureValidAccessToken()
      .then((token) => (token ? fetchMe(token) : null))
      .then((user) => {
        if (cancelled || !user) return;
        setForm((prev) =>
          prev.email ? prev : { ...prev, email: user.email, emailPrefilled: true },
        );
      })
      .catch(() => {
        // No prefill; the email step still asks for one.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const step = STEP_IDS[stepIndex];

  function goTo(id: StepId) {
    setStepIndex(STEP_IDS.indexOf(id));
  }

  function next() {
    setStepIndex((index) => Math.min(index + 1, STEP_IDS.length - 1));
  }

  function back() {
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
        // mark a field as resume-sourced when there's an actual value in it.
        const RESUME_FILLABLE = [
          "firstName",
          "lastName",
          "phone",
          "location",
          "linkedinUrl",
          "githubUrl",
          "portfolioUrl",
        ] as const;
        const fieldSource = { ...prev.fieldSource };
        for (const key of RESUME_FILLABLE) {
          if (fields[key]) fieldSource[key] = "resume";
        }
        // Email follows the same signed-in-beats-resume rule as the value
        // itself below, so it's only "resume" when the resume's address is
        // the one that actually won.
        if (!prev.emailPrefilled && fields.email) fieldSource.email = "resume";

        return {
          ...prev,
          ...fields,
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
    <ScreenShell key={step} step={stepNumber} total={TOTAL_STEPS} onBack={onBack}>
      {step === "welcome" ? <WelcomeScreen onStart={next} /> : null}

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

      {step === "careerArc" ? (
        <UploadScreen
          heading="Career arc document"
          helperText="A longer story of your career, if you have one written up. Skip if not."
          accept={DOCUMENT_ACCEPT}
          optional
          fileName={null}
          state="idle"
          progress={0}
          errorMessage={null}
          onSelect={() => undefined}
          onRemove={() => undefined}
          onNext={next}
          onSkip={next}
          unavailable={CAREER_ARC_PARSING_UNAVAILABLE}
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
          careerArcFileName={null}
          workPreference={form.workPreference}
          targetRoles={form.targetRoles}
          fieldSource={form.fieldSource}
          onEditName={() => goTo("name")}
          onEditEmail={() => goTo("email")}
          onEditPhone={() => goTo("contact")}
          onEditLocation={() => goTo("contact")}
          onEditLinks={() => goTo("links")}
          onEditResume={() => goTo("resume")}
          onEditCareerArc={() => goTo("careerArc")}
          onEditWorkPreference={() => goTo("workPreference")}
          onEditTargetRole={() => goTo("targetRole")}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
        />
      ) : null}
    </ScreenShell>
  );
}
