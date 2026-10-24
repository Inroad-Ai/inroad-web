"use client";

import { useResearchRuns } from "@/lib/research-runs";

import { CompanyResearchPanel } from "./CompanyResearchPanel";
import { MatchScanPanel } from "./MatchScanPanel";
import { MatchScanRow } from "./MatchScanRow";
import { ResearchRunRow } from "./ResearchRunRow";
import { RunListPanel } from "./RunListPanel";
import { useMatchScans } from "./useMatchScans";

export function ResearchWorkspace() {
  const { runs } = useResearchRuns();
  const { matchBusy, matchRuns, runMatch, retryMatchPoll } = useMatchScans();

  return (
    <>
      <section aria-label="Start research" className="grid gap-5 xl:grid-cols-5">
        <CompanyResearchPanel className="xl:col-span-3" />
        <MatchScanPanel
          busy={matchBusy}
          runs={matchRuns}
          onRun={runMatch}
          className="xl:col-span-2"
        />
      </section>

      <section aria-label="Recent runs" className="mt-5 grid gap-5 xl:grid-cols-2">
        <RunListPanel
          title="Company research"
          subtitle="Your recent intelligence requests"
          count={runs.length}
          empty="Research a company to create your first brief."
        >
          {runs.map((run) => (
            <ResearchRunRow key={run.id} run={run} />
          ))}
        </RunListPanel>
        <RunListPanel
          title="Job match scans"
          subtitle="Companies matched to your profile"
          count={matchRuns.length}
          empty="Run a match scan to surface companies aligned with your profile."
        >
          {matchRuns.map((run) => (
            <MatchScanRow key={run.id} run={run} onRetry={retryMatchPoll} />
          ))}
        </RunListPanel>
      </section>
    </>
  );
}
