import { CompanyLogo } from "@/components/ui/CompanyLogo";
import type { DemoSource, FitCardData } from "@/lib/landing/ask-types";

import { CitationChip } from "./CitationChip";

/** A ranked company in an answer. The whole card asks why it fits; the
 * citation chip sits above the card's button so both stay clickable. */
export function FitCard({
  card,
  source,
  picked,
  onPick,
}: {
  card: FitCardData;
  source: DemoSource;
  picked: boolean;
  onPick: () => void;
}) {
  const { company } = card;
  return (
    <div
      className={`relative flex min-w-0 flex-col gap-2 rounded-nest p-3 transition duration-fast ease-standard hover:-translate-y-px hover:bg-surface hover:shadow-card-hover ${
        picked ? "bg-surface shadow-card ring-2 ring-signal-teal" : "bg-surface-raised"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <CompanyLogo logoUrl={null} seed={company.domain} size="sm" />
        <div className="min-w-0">
          <button
            type="button"
            onClick={onPick}
            className="block truncate text-left text-sm font-sans-semibold text-ink after:absolute after:inset-0 after:rounded-nest"
          >
            {company.name}
          </button>
          <p className="font-mono text-2xs text-ink-faint">{company.domain}</p>
        </div>
        <span className="ml-auto font-mono text-xs text-signal-teal">
          {company.fit}
          <span className="text-ink-faint">%</span>
        </span>
      </div>
      <p className="text-xs text-ink-muted">
        {card.why} <CitationChip number={card.cite + 1} source={source} />
      </p>
    </div>
  );
}
