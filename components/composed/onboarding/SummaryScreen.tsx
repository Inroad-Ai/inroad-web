import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/app-icons";
import type { CareerArcDocument } from "@/lib/api-client/client";
import { hasContent, storyCount } from "@/lib/career-arc";
import { plural } from "@/lib/format";
import { linkLabels, workPreferenceLabels, type WorkPreferenceOption } from "@/lib/onboarding";
import type { FieldSourceKey, FieldSourceMap } from "@/lib/types";

import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

// Every row is one fixed-height line: a value and at most one chip. Anything
// longer goes in the chip ("+2") and the full text in the tooltip, so rows
// never grow and the card keeps its shape.
interface SummaryRow {
  label: string;
  value: string;
  /** Short extra, such as "+2" or "55 skills". */
  more?: string;
  /** The whole text, for the tooltip, when `value` shows only part of it. */
  full?: string;
  onEdit: () => void;
  fromResume: boolean;
  /** Skipped or not set: shown quieter than a real value. */
  isEmpty?: boolean;
}

function firstOf(
  items: string[],
  empty: string,
): Pick<SummaryRow, "value" | "more" | "full" | "isEmpty"> {
  if (items.length === 0) return { value: empty, isEmpty: true };
  return {
    value: items[0],
    more: items.length > 1 ? `+${items.length - 1}` : undefined,
    full: items.join(", "),
  };
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
  careerArc,
  fieldSource,
  onEditName,
  onEditEmail,
  onEditPhone,
  onEditLocation,
  onEditLinks,
  onEditResume,
  onEditWorkPreference,
  onEditTargetRole,
  onEditCareerArc,
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
  careerArc: CareerArcDocument | null;
  fieldSource: FieldSourceMap;
  onEditName: () => void;
  onEditEmail: () => void;
  onEditPhone: () => void;
  onEditLocation: () => void;
  onEditLinks: () => void;
  onEditResume: () => void;
  onEditWorkPreference: () => void;
  onEditTargetRole: () => void;
  onEditCareerArc: () => void;
  onSubmit: () => void;
  onBack?: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  const links = linkLabels({ linkedinUrl, githubUrl, portfolioUrl });
  const hasArc = hasContent(careerArc);

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
          isEmpty: !location,
          onEdit: onEditLocation,
          fromResume: fromResume("location"),
        },
        {
          label: "Links",
          ...firstOf(links, "None"),
          onEdit: onEditLinks,
          fromResume: fromResume("linkedinUrl", "githubUrl", "portfolioUrl"),
        },
      ],
    },
    {
      title: "Background",
      rows: [
        {
          label: "Resume",
          value: resumeFileName ?? "Not uploaded",
          more:
            resumeFileName && skills.length ? plural(skills.length, "skill", "skills") : undefined,
          isEmpty: !resumeFileName,
          onEdit: onEditResume,
          fromResume: false,
        },
        {
          label: "Career arc",
          value: hasArc ? plural(careerArc?.roles?.length ?? 0, "chapter", "chapters") : "Skipped",
          more: hasArc ? plural(storyCount(careerArc), "story", "stories") : undefined,
          isEmpty: !hasArc,
          onEdit: onEditCareerArc,
          fromResume: false,
        },
      ],
    },
    {
      title: "Preferences",
      rows: [
        {
          label: "Work preference",
          ...firstOf(workPreferenceLabels(workPreference), "Not set"),
          onEdit: onEditWorkPreference,
          fromResume: false,
        },
        {
          label: "Target roles",
          ...firstOf(targetRoles, "Not set"),
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
        <p className="mt-5 flex items-center gap-2 text-sm text-ink-muted">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal-teal" />
          {resumeSourcedCount} filled from your resume. Worth a quick check.
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-5">
        {sections.map((section) => (
          <section key={section.title} className="min-w-0">
            <Eyebrow as="h2">{section.title}</Eyebrow>
            <Card variant="nested" padding="none" className="mt-2 divide-y divide-line">
              {section.rows.map((row) => (
                <button
                  key={row.label}
                  type="button"
                  onClick={row.onEdit}
                  aria-label={`Change ${row.label.toLowerCase()}`}
                  className="group flex h-16 w-full items-center gap-3 px-4 text-left transition-colors duration-fast first:rounded-t-nest last:rounded-b-nest hover:bg-ink/5 sm:h-14 sm:gap-4"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                    <span className="utility-label shrink-0 whitespace-nowrap text-ink-faint sm:w-36">
                      {row.label}
                    </span>
                    <span
                      title={row.full ?? row.value}
                      className={`min-w-0 flex-1 truncate text-sm ${
                        row.isEmpty ? "text-ink-faint" : "font-sans-semibold text-ink"
                      }`}
                    >
                      {row.value}
                    </span>
                  </span>
                  {row.more ? <Badge>{row.more}</Badge> : null}
                  <span
                    title={row.fromResume ? "Filled from your resume" : undefined}
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      row.fromResume ? "bg-signal-teal" : ""
                    }`}
                  >
                    {row.fromResume ? (
                      <span className="sr-only">Filled from your resume</span>
                    ) : null}
                  </span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink-faint transition-colors duration-fast group-hover:text-signal-teal" />
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
        primaryLabel={submitting ? "Saving..." : "Save profile"}
        isLoading={submitting}
      />
    </div>
  );
}
