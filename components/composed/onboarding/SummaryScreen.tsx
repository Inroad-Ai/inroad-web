import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WORK_PREFERENCE_OPTIONS, type WorkPreferenceOption } from "@/lib/onboarding";

interface SummaryRow {
  label: string;
  value: string;
  onEdit: () => void;
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

  const rows: SummaryRow[] = [
    { label: "Name", value: `${firstName} ${lastName}`, onEdit: onEditName },
    { label: "Email", value: email, onEdit: onEditEmail },
    { label: "Phone", value: phone, onEdit: onEditPhone },
    { label: "Location", value: location || "Not set", onEdit: onEditLocation },
    { label: "Links", value: links.join(", ") || "None", onEdit: onEditLinks },
    {
      label: "Resume",
      value: resumeFileName
        ? `${resumeFileName}${skills.length ? ` — ${skills.length} skills read` : ""}`
        : "Not uploaded",
      onEdit: onEditResume,
    },
    {
      label: "Career arc",
      value: careerArcFileName ?? "Skipped",
      onEdit: onEditCareerArc,
    },
    { label: "Work preference", value: workPreferenceLabel, onEdit: onEditWorkPreference },
    { label: "Target roles", value: targetRoles.join(", "), onEdit: onEditTargetRole },
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
              <p className="utility-label text-text-secondary">{row.label}</p>
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
