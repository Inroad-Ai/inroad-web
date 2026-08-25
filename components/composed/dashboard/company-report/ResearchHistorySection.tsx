"use client";

import { useState } from "react";

import type { CompanyDetail } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";

import { RunRow } from "./RunRow";

const COLLAPSED_RUN_COUNT = 3;

export function ResearchHistorySection({ detail }: { detail: CompanyDetail }) {
  const runs = detail.recent_research_runs;
  const [expanded, setExpanded] = useState(false);

  const collapsible = runs.length > COLLAPSED_RUN_COUNT;
  const shown = collapsible && !expanded ? runs.slice(0, COLLAPSED_RUN_COUNT) : runs;
  // The backend caps what it sends, so the count can exceed what is listed.
  const olderNotSent = detail.research_run_count - runs.length;

  return (
    <Section
      title="Research history"
      meta={
        <span className="utility-label text-text-secondary/70">
          {detail.research_run_count} {detail.research_run_count === 1 ? "run" : "runs"}
        </span>
      }
    >
      {runs.length === 0 ? (
        <EmptyState>No runs recorded for this company yet.</EmptyState>
      ) : (
        <>
          <ul className="divide-y divide-line">
            {shown.map((run) => (
              <RunRow key={run.id} run={run} />
            ))}
          </ul>

          {collapsible ? (
            <Button
              variant="quiet"
              size="sm"
              onClick={() => setExpanded((value) => !value)}
              className="mt-4"
            >
              {expanded ? "Show fewer" : `Show all ${runs.length} recent runs`}
            </Button>
          ) : null}

          {olderNotSent > 0 ? (
            <p className="mt-4 text-xs text-text-secondary/70">
              {olderNotSent} older {olderNotSent === 1 ? "run is" : "runs are"} kept but not shown
              here.
            </p>
          ) : null}
        </>
      )}
    </Section>
  );
}
