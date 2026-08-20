"use client";

import Link from "next/link";
import { useState } from "react";

import { PageShell } from "@/components/composed/dashboard/PageShell";
import { SearchBar } from "@/components/composed/dashboard/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusDot } from "@/components/ui/StatusDot";
import { useResearchRuns, type ResearchRun } from "@/lib/research-runs";

export default function ResearchPage() {
  const [domain, setDomain] = useState("");
  const { runs, startResearch } = useResearchRuns();
  // One at a time in this box, same as before - startResearch itself has no
  // such limit, this is just the input's own UX.
  const busy = runs.some((r) => r.state === "pending");

  function run(next: string) {
    setDomain(next);
    startResearch(next);
  }

  return (
    <PageShell
      title="Research"
      description="Enter a company domain to research it and add it to your companies."
      action={
        <div className="sm:min-w-[26rem]">
          <SearchBar onRun={run} busy={busy} value={domain} />
        </div>
      }
    >
      <div className="mt-6 rounded-md border border-line bg-surface shadow-card">
        <header className="flex items-baseline justify-between gap-3 border-b border-line px-6 py-4">
          <span className="utility-label text-text-secondary">Runs</span>
          {runs.length > 0 ? (
            <span className="utility-label text-text-secondary/60">{runs.length}</span>
          ) : null}
        </header>

        {runs.length === 0 ? (
          <EmptyState className="px-6 py-6">
            Nothing yet. Enter a domain above to research and save a company.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {runs.map((r) => (
              <li key={r.id}>
                <RunRow run={r} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

function RunRow({ run }: { run: ResearchRun }) {
  const body = (
    <div className="flex w-full flex-wrap items-center justify-between gap-3 px-6 py-4 text-left">
      <span className="flex items-center gap-3">
        <StatusDot state={run.state} />
        <span className="font-sans text-sm text-ink">{run.domain}</span>
      </span>
      {run.state === "pending" ? (
        <span className="utility-label text-text-secondary/70">Researching...</span>
      ) : run.state === "failed" ? (
        <span className="text-sm text-error">{run.error}</span>
      ) : (
        <span className="utility-label text-signal-teal">View company</span>
      )}
    </div>
  );

  if (run.state === "done" && run.companyId) {
    return (
      <Link
        href={`/companies/${run.companyId}`}
        className="block transition-colors hover:bg-surface-raised"
      >
        {body}
      </Link>
    );
  }

  return body;
}
