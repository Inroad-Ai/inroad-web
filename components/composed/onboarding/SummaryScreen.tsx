import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WORK_PREFERENCE_OPTIONS, type WorkPreferenceOption } from "@/lib/onboarding";
import type { FieldSourceKey, FieldSourceMap } from "@/lib/types";

interface SummaryRow {
  label: string;
  value: string;
  onEdit: () => void;
  fromResume: boolean;
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
  careerArcFileName,
  workPreference,
  targetRoles,
  fieldSource,
  onEditName,
  onEditEmail,
  onEditPhone,
  onEditLocation,
  onEditLinks,
  onEditResume,
  onEditCareerArc,
  onEditWorkPreference,
  onEditTargetRole,
  onSubmit,
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
  careerArcFileName: string | null;
  workPreference: WorkPreferenceOption[];
  targetRoles: string[];
  fieldSource: FieldSourceMap;
  onEditName: () => void;
  onEditEmail: () => void;
  onEditPhone: () => void;
  onEditLocation: () => void;
  onEditLinks: () => void;
  onEditResume: () => void;
  onEditCareerArc: () => void;
  onEditWorkPreference: () => void;
  onEditTargetRole: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  const workPreferenceLabel = workPreference
    .map((value) => WORK_PREFERENCE_OPTIONS.find((option) => option.value === value)?.label ?? value)
    .join(", ");

  const links = [linkedinUrl, githubUrl, portfolioUrl].filter(Boolean);

  // A row counts as resume-sourced if any of its underlying fields is - a
  // half-parsed row still deserves the "double check this" nudge.
  const fromResume = (...keys: FieldSourceKey[]) =>
    keys.some((key) => fieldSource[key] === "resume");

  const rows: SummaryRow[] = [
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
    {
      label: "Resume",
      value: resumeFileName
        ? `${resumeFileName}${skills.length ? ` — ${skills.length} skills read` : ""}`
        : "Not uploaded",
      onEdit: onEditResume,
      fromResume: false,
    },
    {
      label: "Career arc",
      value: careerArcFileName ?? "Skipped",
      onEdit: onEditCareerArc,
      fromResume: false,
    },
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
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-text-primary">Take a look before you submit</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Tap any row to jump back and change it.
      </p>

      <div className="mt-6 divide-y divide-line rounded-md border border-line bg-surface shadow-card">
        {rows.map((row) => (
          <button
            key={row.label}
            type="button"
            onClick={row.onEdit}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-raised"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="utility-label text-text-secondary">{row.label}</p>
                {row.fromResume ? <Badge tone="teal">From resume</Badge> : null}
              </div>
              <p className="mt-1 truncate text-sm text-text-primary">{row.value}</p>
            </div>
            <span className="utility-label shrink-0 text-signal-teal">Edit</span>
          </button>
        ))}
      </div>

      {submitError ? (
        <div className="mt-6 rounded-md border border-error/40 bg-error-subtle p-4">
          <Badge tone="rose">Could not save</Badge>
          <p className="mt-2 text-sm text-text-primary">{submitError}</p>
          <p className="mt-1 text-xs text-text-secondary">
            Nothing you entered was lost. Try submitting again.
          </p>
        </div>
      ) : null}

      <Button type="button" onClick={onSubmit} disabled={submitting} className="mt-8">
        {submitting ? "Saving..." : "Complete setup"}
      </Button>
    </div>
  );
}
