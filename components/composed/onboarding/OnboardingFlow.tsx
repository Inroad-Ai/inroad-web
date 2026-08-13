"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ScreenShell } from "@/components/composed/onboarding/ScreenShell";
import { WelcomeScreen } from "@/components/composed/onboarding/WelcomeScreen";
import { NameScreen } from "@/components/composed/onboarding/NameScreen";
import { EmailScreen } from "@/components/composed/onboarding/EmailScreen";
import { PhoneScreen } from "@/components/composed/onboarding/PhoneScreen";
import { UploadScreen } from "@/components/composed/onboarding/UploadScreen";
import { WorkPreferenceScreen } from "@/components/composed/onboarding/WorkPreferenceScreen";
import { TargetRoleScreen } from "@/components/composed/onboarding/TargetRoleScreen";
import { SummaryScreen } from "@/components/composed/onboarding/SummaryScreen";
import { fetchMe, saveProfile } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { FILE_STORAGE_UNAVAILABLE } from "@/lib/profile";
import { type WorkPreferenceOption } from "@/lib/onboarding";

const STEP_IDS = [
  "welcome",
  "name",
  "email",
  "phone",
  "resume",
  "careerArc",
  "workPreference",
  "targetRole",
  "summary",
] as const;

type StepId = (typeof STEP_IDS)[number];

const TOTAL_STEPS = STEP_IDS.length;

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  emailPrefilled: boolean;
  phone: string;
  workPreference: WorkPreferenceOption[];
  targetRoles: string[];
}

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  emailPrefilled: false,
  phone: "",
  workPreference: [],
  targetRoles: [],
};

export function OnboardingFlow() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
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

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setSubmitError("Your session expired. Sign in again to finish setup.");
        return;
      }

      // Null until uploads migrate off Supabase Storage.
      await saveProfile(
        {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          resume_storage_path: null,
          career_arc_storage_path: null,
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

      {step === "name" ? (
        <NameScreen
          firstName={form.firstName}
          lastName={form.lastName}
          onChange={(firstName, lastName) => setForm((prev) => ({ ...prev, firstName, lastName }))}
          onNext={next}
        />
      ) : null}

      {step === "email" ? (
        <EmailScreen
          email={form.email}
          prefilled={form.emailPrefilled}
          onChange={(email) => setForm((prev) => ({ ...prev, email, emailPrefilled: false }))}
          onNext={next}
        />
      ) : null}

      {step === "phone" ? (
        <PhoneScreen
          phone={form.phone}
          onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
          onNext={next}
        />
      ) : null}

      {step === "resume" ? (
        <UploadScreen
          heading="Upload your resume"
          helperText="PDF or DOCX. We store it as-is, parsing happens later."
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          optional={false}
          fileName={null}
          state="idle"
          progress={0}
          errorMessage={null}
          onSelect={() => undefined}
          onRemove={() => undefined}
          onNext={next}
          unavailable={FILE_STORAGE_UNAVAILABLE}
        />
      ) : null}

      {step === "careerArc" ? (
        <UploadScreen
          heading="Career arc document"
          helperText="A longer story of your career, if you have one written up. Skip if not."
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          optional
          fileName={null}
          state="idle"
          progress={0}
          errorMessage={null}
          onSelect={() => undefined}
          onRemove={() => undefined}
          onNext={next}
          onSkip={next}
          unavailable={FILE_STORAGE_UNAVAILABLE}
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
          resumeFileName={null}
          careerArcFileName={null}
          workPreference={form.workPreference}
          targetRoles={form.targetRoles}
          onEditName={() => goTo("name")}
          onEditEmail={() => goTo("email")}
          onEditPhone={() => goTo("phone")}
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
