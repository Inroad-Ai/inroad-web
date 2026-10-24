"use client";

import { motion } from "framer-motion";

import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";
import { linkLabels, workPreferenceLabels } from "@/lib/onboarding";
import type { FieldSourceKey } from "@/lib/types";

import type { FormState, ResumeState } from "./onboarding-form";

interface ProfileRow {
  label: string;
  value: string;
  sources: FieldSourceKey[];
}

function buildRows(form: FormState, resume: ResumeState): ProfileRow[] {
  const resumeValue =
    resume.state === "done" && resume.fileName
      ? `${resume.fileName}${form.skills.length ? ` · ${form.skills.length} skills` : ""}`
      : "";
  return [
    { label: "Resume", value: resumeValue, sources: [] },
    {
      label: "Name",
      value: `${form.firstName} ${form.lastName}`.trim(),
      sources: ["firstName", "lastName"],
    },
    { label: "Email", value: form.email.trim(), sources: ["email"] },
    { label: "Phone", value: form.phone.trim(), sources: ["phone"] },
    { label: "Location", value: form.location.trim(), sources: ["location"] },
    {
      label: "Links",
      value: linkLabels(form).join(", "),
      sources: ["linkedinUrl", "githubUrl", "portfolioUrl"],
    },
    { label: "Work", value: workPreferenceLabels(form.workPreference).join(", "), sources: [] },
    { label: "Roles", value: form.targetRoles.join(", "), sources: [] },
  ];
}

/** A quiet summary beside the form that fills in as each answer lands. */
export function ProfileSoFar({ form, resume }: { form: FormState; resume: ResumeState }) {
  const isStill = useLandingMotion();
  const rows = buildRows(form, resume);
  const filled = rows.filter((row) => row.value).length;

  return (
    <Card as="section" padding="md" aria-label="Your profile so far">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow as="h2">Your profile so far</Eyebrow>
        <span className="font-mono text-xs text-ink-faint">
          {filled}/{rows.length}
        </span>
      </div>
      <dl className="mt-4 grid gap-3.5">
        {rows.map((row) => {
          const isFromResume = row.sources.some((key) => form.fieldSource[key] === "resume");
          return (
            <div key={row.label} className="grid gap-0.5">
              <dt className="utility-label flex items-center gap-2 text-ink-faint">
                {row.label}
                {row.value && isFromResume ? (
                  <span className="text-signal-teal">from resume</span>
                ) : null}
              </dt>
              <motion.dd
                key={row.value ? "filled" : "empty"}
                initial={isStill ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.36, ease: LANDING_EASE }}
                className={`truncate text-sm ${row.value ? "font-sans-semibold text-ink" : "text-ink-faint"}`}
              >
                {row.value || "Not yet"}
              </motion.dd>
            </div>
          );
        })}
      </dl>
    </Card>
  );
}
