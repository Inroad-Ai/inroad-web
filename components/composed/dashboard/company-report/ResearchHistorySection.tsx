"use client";

import { useState } from "react";

import { plural } from "@/lib/format";
import type { CompanyDetail } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

import { DashboardPanel } from "../DashboardPanel";
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
    <DashboardPanel
      title="Research history"
      meta={
        <span className="utility-label text-ink-faint">
          {plural(detail.research_run_count, "run", "runs")}
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
            <p className="mt-4 text-xs text-ink-faint">
              {plural(olderNotSent, "older run is", "older runs are")} kept but not shown here.
            </p>
          ) : null}
        </>
      )}
    </DashboardPanel>
  );
}
