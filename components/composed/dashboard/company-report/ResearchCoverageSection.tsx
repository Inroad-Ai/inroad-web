import type { CompanyDetail, CoverageStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";

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

const STATUS: Record<
  CoverageStatus,
  { text: string; tone: "success" | "teal" | "amber" | "rose" | "neutral" }
> = {
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
    <Section
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
      <ul className="grid gap-4 sm:grid-cols-2">
        {names.map((name) => {
          const entry = coverage[name];
          const status = STATUS[entry.status] ?? STATUS.not_researched;
          return (
            <li key={name}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-ink">{LABELS[name]}</span>
                <Badge tone={status.tone}>{status.text}</Badge>
              </div>
              <p className="mt-1 text-xs text-text-secondary">
                {entry.reason.endsWith(".") ? entry.reason : `${entry.reason}.`}
                {entry.fresh_until ? ` Fresh until ${day(entry.fresh_until)}.` : ""}
              </p>
            </li>
          );
        })}
      </ul>

      {failures.length > 0 ? (
        <ul className="mt-6 space-y-1">
          {failures.map((failure) => (
            <li key={failure} className="text-xs text-text-secondary">
              Partial: {failure}
            </li>
          ))}
        </ul>
      ) : null}

      {usage.length > 0 ? (
        <div className="mt-6">
          <p className="utility-label font-sans-semibold text-text-secondary">Collected with</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {usage.map((item) => (
              <Badge key={`${item.provider}-${item.operation}`} tone="neutral">
                {`${item.provider} ${item.operation}: ${item.requests} request${item.requests === 1 ? "" : "s"}`}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
