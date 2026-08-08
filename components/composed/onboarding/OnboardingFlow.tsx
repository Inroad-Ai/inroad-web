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
import { createClient } from "@/lib/supabase/browser";
import {
  submitOnboardingProfile,
  uploadOnboardingFile,
  type UploadState,
  type WorkPreferenceOption,
} from "@/lib/onboarding";

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
  resumeFileName: string | null;
  resumeStoragePath: string | null;
  resumeUploadState: UploadState;
  resumeUploadProgress: number;
  resumeError: string | null;
  careerArcFileName: string | null;
  careerArcStoragePath: string | null;
  careerArcUploadState: UploadState;
  careerArcUploadProgress: number;
  careerArcError: string | null;
  workPreference: WorkPreferenceOption[];
  targetRole: string;
}

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  emailPrefilled: false,
  phone: "",
  resumeFileName: null,
  resumeStoragePath: null,
  resumeUploadState: "idle",
  resumeUploadProgress: 0,
  resumeError: null,
  careerArcFileName: null,
  careerArcStoragePath: null,
  careerArcUploadState: "idle",
  careerArcUploadProgress: 0,
  careerArcError: null,
  workPreference: [],
  targetRole: "",
};

export function OnboardingFlow() {
  const router = useRouter();
  const supabase = createClient();

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      setUserId(user.id);
      if (user.email) {
        setForm((prev) => (prev.email ? prev : { ...prev, email: user.email!, emailPrefilled: true }));
      }
    });
    // Only needs to run once on mount - the session doesn't change mid-flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function handleUpload(
    bucket: "resumes" | "career-arc-documents",
    field: "resume" | "careerArc",
    file: File,
  ) {
    if (!userId) {
      setForm((prev) =>
        field === "resume"
          ? { ...prev, resumeError: "You need to be signed in to upload a file.", resumeUploadState: "error" }
          : {
              ...prev,
              careerArcError: "You need to be signed in to upload a file.",
              careerArcUploadState: "error",
            },
      );
      return;
    }

    setForm((prev) =>
      field === "resume"
        ? {
            ...prev,
            resumeFileName: file.name,
            resumeUploadState: "uploading",
            resumeUploadProgress: 0,
            resumeError: null,
          }
        : {
            ...prev,
            careerArcFileName: file.name,
            careerArcUploadState: "uploading",
            careerArcUploadProgress: 0,
            careerArcError: null,
          },
    );

    try {
      const path = await uploadOnboardingFile({
        supabase,
        bucket,
        userId,
        file,
        onProgress: (percent) =>
          setForm((prev) =>
            field === "resume"
              ? { ...prev, resumeUploadProgress: percent }
              : { ...prev, careerArcUploadProgress: percent },
          ),
      });
      setForm((prev) =>
        field === "resume"
          ? { ...prev, resumeStoragePath: path, resumeUploadState: "done" }
          : { ...prev, careerArcStoragePath: path, careerArcUploadState: "done" },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      setForm((prev) =>
        field === "resume"
          ? { ...prev, resumeUploadState: "error", resumeError: message }
          : { ...prev, careerArcUploadState: "error", careerArcError: message },
      );
    }
  }

  function removeUpload(field: "resume" | "careerArc") {
    setForm((prev) =>
      field === "resume"
        ? {
            ...prev,
            resumeFileName: null,
            resumeStoragePath: null,
            resumeUploadState: "idle",
            resumeUploadProgress: 0,
            resumeError: null,
          }
        : {
            ...prev,
            careerArcFileName: null,
            careerArcStoragePath: null,
            careerArcUploadState: "idle",
            careerArcUploadProgress: 0,
            careerArcError: null,
          },
    );
  }

  async function handleSubmit() {
    if (!userId) {
      setSubmitError("You need to be signed in to finish setup.");
      return;
    }
    if (!form.resumeStoragePath) {
      setSubmitError("A resume upload is required before you can finish.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitOnboardingProfile(supabase, userId, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        resumeStoragePath: form.resumeStoragePath,
        careerArcStoragePath: form.careerArcStoragePath,
        workPreference: form.workPreference,
        targetRole: form.targetRole.trim(),
      });
      router.push("/app");
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
          fileName={form.resumeFileName}
          state={form.resumeUploadState}
          progress={form.resumeUploadProgress}
          errorMessage={form.resumeError}
          onSelect={(file) => handleUpload("resumes", "resume", file)}
          onRemove={() => removeUpload("resume")}
          onNext={next}
        />
      ) : null}

      {step === "careerArc" ? (
        <UploadScreen
          heading="Career arc document"
          helperText="A longer story of your career, if you have one written up. Skip if not."
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          optional
          fileName={form.careerArcFileName}
          state={form.careerArcUploadState}
          progress={form.careerArcUploadProgress}
          errorMessage={form.careerArcError}
          onSelect={(file) => handleUpload("career-arc-documents", "careerArc", file)}
          onRemove={() => removeUpload("careerArc")}
          onNext={next}
          onSkip={next}
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
          targetRole={form.targetRole}
          onChange={(targetRole) => setForm((prev) => ({ ...prev, targetRole }))}
          onNext={next}
        />
      ) : null}

      {step === "summary" ? (
        <SummaryScreen
          firstName={form.firstName}
          lastName={form.lastName}
          email={form.email}
          phone={form.phone}
          resumeFileName={form.resumeFileName}
          careerArcFileName={form.careerArcFileName}
          workPreference={form.workPreference}
          targetRole={form.targetRole}
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
