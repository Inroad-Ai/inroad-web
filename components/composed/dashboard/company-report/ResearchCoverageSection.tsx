import type { CompanyDossier, ResearchCoverage } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";

type CoverageState = "complete" | "incomplete" | "failed" | "not_started";

interface CoverageRow {
  name: string;
  state: CoverageState;
  detail: string;
  targetId: string;
}

function stateFor(entries: Array<ResearchCoverage | undefined>): CoverageState {
  const usable = entries.filter((entry): entry is ResearchCoverage => entry !== undefined);
  if (usable.length === 0) return "not_started";
  if (entries.some((entry) => entry?.status === "collection_failed")) return "failed";
  if (usable.every((entry) => entry.status === "not_researched")) {
    return "not_started";
  }
  if (
    entries.some((entry) => entry?.status === "not_researched" || entry?.status === "not_found")
  ) {
    return "incomplete";
  }
  return "complete";
}

function detailFor(entries: Array<ResearchCoverage | undefined>): string {
  const usable = entries.filter((entry): entry is ResearchCoverage => entry !== undefined);
  const problem = usable.find(
    (entry) =>
      entry.status === "collection_failed" ||
      entry.status === "not_researched" ||
      entry.status === "not_found",
  );
  if (problem) return problem.reason;

  const items = usable.reduce((total, entry) => total + entry.items, 0);
  return items > 0 ? `${items} item${items === 1 ? "" : "s"} found` : "Current";
}

function badge(state: CoverageState): {
  tone: "success" | "amber" | "rose" | "neutral";
  label: string;
} {
  if (state === "complete") return { tone: "success", label: "Done" };
  if (state === "incomplete") return { tone: "amber", label: "Incomplete" };
  if (state === "failed") return { tone: "rose", label: "Failed" };
  return { tone: "neutral", label: "Not run" };
}

export function ResearchCoverageSection({ research }: { research: CompanyDossier | null }) {
  if (research === null) return null;

  const coverage = research.coverage ?? {};
  const rows: CoverageRow[] = [
    {
      name: "Company research",
      state: stateFor([coverage.homepage, coverage.hiring]),
      detail: detailFor([coverage.homepage, coverage.hiring]),
      targetId: "company-research",
    },
    {
      name: "News",
      state: stateFor([coverage.news]),
      detail: detailFor([coverage.news]),
      targetId: "news-research",
    },
    {
      name: "People",
      state: stateFor([coverage.people]),
      detail: detailFor([coverage.people]),
      targetId: "people-research",
    },
  ];

  return (
    <Section title="Research coverage">
      <ul className="divide-y divide-line">
        {rows.map((row) => {
          const status = badge(row.state);
          return (
            <li
              key={row.name}
              className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium text-ink">{row.name}</p>
                <p className="mt-1 text-sm text-text-secondary">{row.detail}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={status.tone}>{status.label}</Badge>
                <a
                  href={`#${row.targetId}`}
                  aria-label={`View ${row.name.toLowerCase()}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-raised hover:text-signal-teal"
                >
                  <ArrowRightIcon />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
