import { plural } from "@/lib/format";
import type { CompanyDetail, CoverageStatus } from "@/lib/types";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { DashboardPanel } from "../DashboardPanel";

const LABELS: Record<string, string> = {
  overview: "Overview",
  products: "Products",
  leadership: "Leadership",
  engineering: "Engineering",
  hiring: "Hiring statements",
  job_openings: "Job openings",
  people: "People",
  news: "News and signals",
};

const STATUS: Record<CoverageStatus, { text: string; tone: BadgeTone }> = {
  found_verified: { text: "Found, with evidence", tone: "success" },
  found_uncertain: { text: "Found, pages disagree", tone: "amber" },
  not_found: { text: "Nothing stated", tone: "neutral" },
  not_researched: { text: "Not researched", tone: "neutral" },
  collection_failed: { text: "Could not collect", tone: "rose" },
};

function day(value: string | null | undefined): string | null {
  return value ? value.slice(0, 10) : null;
}

/** What this research covered, per category, and where it came from.
 * A missing category is stated as unknown, never as a negative finding. */
export function ResearchCoverageSection({ detail }: { detail: CompanyDetail }) {
  const research = detail.latest_research;
  if (research?.research_backend !== "sourcing") return null;
  const coverage = research.coverage ?? {};
  const names = Object.keys(LABELS).filter((name) => name in coverage);
  const usage = research.provider_usage ?? [];
  const failures = research.partial_failures ?? [];
  if (names.length === 0 && usage.length === 0) return null;

  return (
    <DashboardPanel
      title="Research coverage"
      meta={
        research.researched_at ? (
          <Badge tone="neutral">
            {research.research_reused ? "Reused research from " : "Researched "}
            {day(research.researched_at)}
          </Badge>
        ) : null
      }
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {names.map((name) => {
          const entry = coverage[name];
          const status = STATUS[entry.status] ?? STATUS.not_researched;
          return (
            <Card as="li" key={name} variant="nested" padding="none" className="p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-sans-semibold text-ink">{LABELS[name]}</span>
                <Badge tone={status.tone} dot>
                  {status.text}
                </Badge>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                {entry.reason.endsWith(".") ? entry.reason : `${entry.reason}.`}
                {entry.fresh_until ? ` Fresh until ${day(entry.fresh_until)}.` : ""}
              </p>
            </Card>
          );
        })}
      </ul>

      {failures.length > 0 ? (
        <ul className="mt-6 space-y-1">
          {failures.map((failure) => (
            <li key={failure} className="text-xs text-ink-muted">
              Partial: {failure}
            </li>
          ))}
        </ul>
      ) : null}

      {usage.length > 0 ? (
        <div className="mt-6">
          <Eyebrow as="h3">Collected with</Eyebrow>
          <div className="mt-2 flex flex-wrap gap-2">
            {usage.map((item) => (
              <Badge key={`${item.provider}-${item.operation}`} tone="neutral">
                {`${item.provider} ${item.operation}: ${plural(item.requests, "request", "requests")}`}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </DashboardPanel>
  );
}
