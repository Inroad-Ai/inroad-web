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
  submitting: boolean;
  submitError: string | null;
}) {
  const workPreferenceLabel = workPreference
    .map((value) => WORK_PREFERENCE_OPTIONS.find((option) => option.value === value)?.label ?? value)
    .join(", ");

  // Platform names, not the raw URLs - three full links joined together just
  // truncates into an unreadable ellipsis on this row's single line.
  const linkLabels = [
    linkedinUrl ? "LinkedIn" : null,
    githubUrl ? "GitHub" : null,
    portfolioUrl ? "Portfolio" : null,
  ].filter((label): label is string => label !== null);

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
          value: linkLabels.join(", ") || "None",
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
      <h1 className="font-display text-2xl text-text-primary">Take a look before you submit</h1>
      <p className="mt-2 text-sm text-text-secondary">Tap any row to jump back and change it.</p>

      {resumeSourcedCount > 0 ? (
        <div className="mt-6 flex items-center gap-2 rounded-md border border-signal-teal/30 bg-signal-teal/5 px-4 py-3">
          <Badge tone="teal">{resumeSourcedCount} from your resume</Badge>
          <span className="text-sm text-text-secondary">Worth a quick check before you submit.</span>
        </div>
      ) : null}

      <div className="mt-6 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="utility-label text-text-secondary">{section.title}</p>
            <div className="mt-2 divide-y divide-line rounded-md border border-line bg-surface shadow-card">
              {section.rows.map((row) => (
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
          </div>
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
