"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { lastLiveFetchAt, relativeTime, totalTimeSeconds } from "@/lib/api";
import type { CompanyDossier } from "@/lib/types";

interface HistoryListProps {
  runs: CompanyDossier[];
  onSelect: (dossier: CompanyDossier) => void;
  activeDomain: string | null;
}

export function HistoryList({ runs, onSelect, activeDomain }: HistoryListProps) {
  return (
    <section className="rounded-md border border-line bg-surface shadow-card">
      <header className="flex items-baseline justify-between gap-3 border-b border-line px-6 py-4">
        <span className="utility-label text-text-secondary">Earlier runs</span>
        {runs.length > 0 ? (
          <span className="utility-label text-text-secondary/60">
            {runs.length}
          </span>
        ) : null}
      </header>

      {runs.length === 0 ? (
        <EmptyState className="px-6 py-6">
          Nothing yet. Runs show up here as you make them.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-line">
          {runs.map((run, index) => (
            <li key={`${run.domain}-${index}`}>
              <button
                type="button"
                onClick={() => onSelect(run)}
                className={`flex w-full items-baseline justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-surface-raised ${
                  run.domain === activeDomain ? "bg-surface-raised" : ""
                }`}
              >
                <span className="font-sans text-sm text-ink">{run.domain}</span>
                <span className="flex items-baseline gap-5">
                  <When domain={run.domain} />
                  <span className="font-sans text-sm text-text-secondary">
                    {totalTimeSeconds(run.elapsed_ms)}s
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {runs.length > 0 ? (
        <p className="border-t border-line px-6 py-3 text-xs text-text-secondary/70">
          Opening a row shows what that run returned. It does not check again.
        </p>
      ) : null}
    </section>
  );
}

/**
 * A run carries no timestamp, so this only has a time for domains this browser
 * ran itself. For anything else it says so rather than inventing one.
 */
function When({ domain }: { domain: string }) {
  const [when, setWhen] = useState<string | null>(null);

  useEffect(() => {
    const at = lastLiveFetchAt(domain);
    setWhen(at === null ? null : relativeTime(at));
  }, [domain]);

  return (
    <span className="utility-label text-text-secondary/70">
      {when ?? "earlier"}
    </span>
  );
}
