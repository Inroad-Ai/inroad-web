"use client";

import { useEffect, useState } from "react";

import { lastLiveFetchAt, relativeTime, totalTimeSeconds } from "@/lib/api";
import type { CompanyDossier } from "@/lib/types";

interface HistoryListProps {
  runs: CompanyDossier[];
  onSelect: (dossier: CompanyDossier) => void;
  activeDomain: string | null;
}

export function HistoryList({ runs, onSelect, activeDomain }: HistoryListProps) {
  return (
    <section>
      <h2 className="utility-label text-paper/45">Earlier runs</h2>

      {runs.length === 0 ? (
        <p className="mt-4 text-sm text-paper/45">
          Nothing yet. Runs show up here as you make them.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {runs.map((run, index) => (
            <li key={`${run.domain}-${index}`}>
              <button
                type="button"
                onClick={() => onSelect(run)}
                className={`flex w-full items-baseline justify-between gap-4 px-1 py-3 text-left transition-colors hover:bg-surface ${
                  run.domain === activeDomain ? "bg-surface" : ""
                }`}
              >
                <span className="font-mono text-sm text-paper">{run.domain}</span>
                <span className="flex items-baseline gap-5">
                  <When domain={run.domain} />
                  <span className="font-mono text-sm text-paper/70">
                    {totalTimeSeconds(run.elapsed_ms)}s
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {runs.length > 0 ? (
        <p className="mt-3 text-xs text-paper/40">
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
    <span className="utility-label text-paper/40">
      {when ?? "earlier"}
    </span>
  );
}
