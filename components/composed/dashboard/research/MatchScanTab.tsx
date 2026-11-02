"use client";

import { Button } from "@/components/ui/Button";
import { TargetIcon } from "@/components/ui/Icons";
import { USUAL_SCAN_RANGE } from "@/lib/match-scan";

import { DashboardPanel } from "../DashboardPanel";
import { MatchScanRow } from "./MatchScanRow";
import { ScanTimer } from "./ScanTimer";
import { isMatchInFlight, type useMatchScans } from "./useMatchScans";

/** Takes the scans from the page, so switching tabs never drops a scan
 * that is still being followed. */
export function MatchScanTab({ scans }: { scans: ReturnType<typeof useMatchScans> }) {
  const { matchBusy, matchRuns, runMatch, retryMatchPoll } = scans;
  const running = matchRuns.find(isMatchInFlight);

  return (
    <div className="flex flex-col gap-6">
      <DashboardPanel
        title="Find companies for me"
        description="Searches current openings against your target roles, skills, location and work preference, checks each company is real and hiring, and saves up to 5 that fit."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" onClick={runMatch} disabled={matchBusy} icon={<TargetIcon />}>
            {matchBusy ? "Starting..." : "Find companies"}
          </Button>
          <p className="text-sm text-ink-muted">Usually ready in {USUAL_SCAN_RANGE}.</p>
        </div>
        {running ? <ScanTimer startedAt={running.startedAt} /> : null}
      </DashboardPanel>

      {matchRuns.length > 0 ? (
        <DashboardPanel title="Your scans">
          <ul className="-mx-2 divide-y divide-line">
            {matchRuns.map((run) => (
              <MatchScanRow key={run.id} run={run} onRetry={retryMatchPoll} />
            ))}
          </ul>
        </DashboardPanel>
      ) : null}
    </div>
  );
}
