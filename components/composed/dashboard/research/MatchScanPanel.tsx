import { Button } from "@/components/ui/Button";
import { TargetIcon } from "@/components/ui/Icons";
import { USUAL_SCAN_RANGE } from "@/lib/match-scan";

import { DashboardPanel } from "../DashboardPanel";
import { ScanTimer } from "./ScanTimer";
import { isMatchInFlight, type MatchRun } from "./useMatchScans";

export function MatchScanPanel({
  busy,
  runs,
  onRun,
  className = "",
}: {
  busy: boolean;
  runs: MatchRun[];
  onRun: () => void;
  className?: string;
}) {
  const running = runs.find(isMatchInFlight);

  return (
    <DashboardPanel
      eyebrow="Profile-led discovery"
      title="Find your next best-fit company"
      description="Search current hiring signals against your target roles, skills and work preferences."
      className={className}
    >
      <Button
        variant="quiet"
        size="lg"
        onClick={onRun}
        disabled={busy}
        icon={<TargetIcon />}
        className="w-full"
      >
        {busy ? "Starting match scan..." : "Run job match scan"}
      </Button>
      <p className="mt-3 text-center text-xs text-ink-faint">Usually ready in {USUAL_SCAN_RANGE}</p>
      {running ? <ScanTimer startedAt={running.startedAt} /> : null}
    </DashboardPanel>
  );
}
