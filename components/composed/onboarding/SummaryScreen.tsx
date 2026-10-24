import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { linkLabels, workPreferenceLabels, type WorkPreferenceOption } from "@/lib/onboarding";
import type { FieldSourceKey, FieldSourceMap } from "@/lib/types";

import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

interface SummaryRow {
  label: string;
  value: string;
  onEdit: () => void;
  fromResume: boolean;
}

interface SummarySection {
  title: string;
  rows: SummaryRow[];
}

export function SummaryScreen({
  firstName,
  lastName,
  email,
  phone,
  location,
  linkedinUrl,
  githubUrl,
  portfolioUrl,
  skills,
  resumeFileName,
  workPreference,
  targetRoles,
  fieldSource,
  onEditName,
  onEditEmail,
  onEditPhone,
  onEditLocation,
  onEditLinks,
  onEditResume,
  onEditWorkPreference,
  onEditTargetRole,
  onSubmit,
  onBack,
  submitting,
  submitError,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  skills: string[];
  resumeFileName: string | null;
  workPreference: WorkPreferenceOption[];
  targetRoles: string[];
  fieldSource: FieldSourceMap;
  onEditName: () => void;
  onEditEmail: () => void;
  onEditPhone: () => void;
  onEditLocation: () => void;
  onEditLinks: () => void;
  onEditResume: () => void;
  onEditWorkPreference: () => void;
  onEditTargetRole: () => void;
  onSubmit: () => void;
  onBack?: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  const workPreferenceLabel = workPreferenceLabels(workPreference).join(", ");
  const links = linkLabels({ linkedinUrl, githubUrl, portfolioUrl });

  // A row counts as resume-sourced if any of its underlying fields is - a
  // half-parsed row still deserves the "double check this" nudge.
  const fromResume = (...keys: FieldSourceKey[]) =>
    keys.some((key) => fieldSource[key] === "resume");

  const sections: SummarySection[] = [
    {
      title: "Contact",
      rows: [
        {
          label: "Name",
          value: `${firstName} ${lastName}`,
          onEdit: onEditName,
          fromResume: fromResume("firstName", "lastName"),
        },
        { label: "Email", value: email, onEdit: onEditEmail, fromResume: fromResume("email") },
        { label: "Phone", value: phone, onEdit: onEditPhone, fromResume: fromResume("phone") },
        {
          label: "Location",
          value: location || "Not set",
          onEdit: onEditLocation,
          fromResume: fromResume("location"),
        },
        {
          label: "Links",
          value: links.join(", ") || "None",
          onEdit: onEditLinks,
          fromResume: fromResume("linkedinUrl", "githubUrl", "portfolioUrl"),
        },
      ],
    },
    {
      title: "Resume",
      rows: [
        {
          label: "Resume",
          value: resumeFileName
            ? `${resumeFileName}${skills.length ? ` (${skills.length} skills read)` : ""}`
            : "Not uploaded",
          onEdit: onEditResume,
          fromResume: false,
        },
      ],
    },
    {
      title: "Job preferences",
      rows: [
        {
          label: "Work preference",
          value: workPreferenceLabel,
          onEdit: onEditWorkPreference,
          fromResume: false,
        },
        {
          label: "Target roles",
          value: targetRoles.join(", "),
          onEdit: onEditTargetRole,
          fromResume: false,
        },
      ],
    },
  ];

  const resumeSourcedCount = sections
    .flatMap((section) => section.rows)
    .filter((row) => row.fromResume).length;

  return (
    <div>
      <StepHeading title="Take a look before you submit">
        Tap any row to jump back and change it.
      </StepHeading>

      {resumeSourcedCount > 0 ? (
        <Card
          variant="nested"
          padding="none"
          className="mt-6 flex flex-wrap items-center gap-3 px-4 py-3"
        >
          <Badge tone="teal">{resumeSourcedCount} from your resume</Badge>
          <span className="text-sm text-ink-muted">Worth a quick check before you submit.</span>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-6">
        {sections.map((section) => (
          <section key={section.title}>
            <Eyebrow as="h2">{section.title}</Eyebrow>
            <Card variant="nested" padding="none" className="mt-2 divide-y divide-line">
              {section.rows.map((row) => (
                <button
                  key={row.label}
                  type="button"
                  onClick={row.onEdit}
                  className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3.5 text-left transition-colors duration-fast first:rounded-t-nest last:rounded-b-nest hover:bg-ink/5"
                >
                  <span className="utility-label w-28 shrink-0 text-ink-faint">{row.label}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-sans-semibold text-ink">
                    {row.value}
                  </span>
                  {row.fromResume ? <Badge tone="teal">From resume</Badge> : null}
                  <span className="utility-label shrink-0 text-signal-teal">Edit</span>
                </button>
              ))}
            </Card>
          </section>
        ))}
      </div>

      {submitError ? (
        <div className="mt-6 rounded-nest bg-error-subtle p-4" role="alert">
          <Badge tone="rose">Could not save</Badge>
          <p className="mt-2 text-sm text-ink">{submitError}</p>
          <p className="mt-1 text-xs text-ink-muted">
            Nothing you entered was lost. Try submitting again.
          </p>
        </div>
      ) : null}

      <StepFooter
        onBack={onBack}
        onPrimary={onSubmit}
        primaryLabel={submitting ? "Saving..." : "Complete setup"}
        isLoading={submitting}
      />
    </div>
  );
}
