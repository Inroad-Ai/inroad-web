"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { lastLiveFetchAt, relativeTime, totalTimeSeconds } from "@/lib/api";
import type { CompanyDossier } from "@/lib/types";

export function DossierSummary({ dossier }: { dossier: CompanyDossier }) {
  return (
    <section className="flex flex-wrap items-end justify-between gap-6 rounded-md border border-line bg-surface p-7 shadow-overlay">
      <div>
        <p className="utility-label text-text-secondary">Domain</p>
        <p className="mt-1 font-display text-2xl text-ink">{dossier.domain}</p>
      </div>

      <div className="text-right">
        <p className="utility-label text-text-secondary">Total time</p>
        <p className="mt-1 font-display text-5xl leading-none text-signal-amber">
          {totalTimeSeconds(dossier.elapsed_ms)}
          <span className="ml-2 text-xl text-text-secondary">s</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CacheBadge dossier={dossier} />
        {dossier.partial ? (
          <Badge tone="rose">
            {Object.keys(dossier.errors).length} of 3 came back empty
          </Badge>
        ) : null}
      </div>
    </section>
  );
}

function CacheBadge({ dossier }: { dossier: CompanyDossier }) {
  // The dossier carries no timestamp, so the relative time can only come from
  // what this browser recorded. Rendered after mount so the server and client
  // markup agree.
  const [since, setSince] = useState<string | null>(null);

  useEffect(() => {
    if (!dossier.from_cache) {
      setSince(null);
      return;
    }
    const at = lastLiveFetchAt(dossier.domain);
    setSince(at === null ? null : relativeTime(at));
  }, [dossier]);

  if (!dossier.from_cache) return <Badge tone="teal">Fetched live</Badge>;

  return (
    <Badge tone="amber">
      Cached
      {since ? <span className="text-signal-amber/60">{since}</span> : null}
    </Badge>
  );
}
