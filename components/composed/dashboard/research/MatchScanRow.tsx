import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { plural } from "@/lib/format";
import type { CardState } from "@/lib/types";

import { MatchElapsedStatus } from "./MatchElapsedStatus";
import { StatusIcon } from "./StatusIcon";
import { isMatchInFlight, type MatchRun } from "./useMatchScans";

function scanState(run: MatchRun, inFlight: boolean): CardState {
  if (run.timedOut || run.status === "failed") return "failed";
  return inFlight ? "pending" : "done";
}

function scanTitle(run: MatchRun, inFlight: boolean): string {
  if (run.timedOut) return "Taking longer than expected";
  if (inFlight) return "Searching for relevant companies";
  if (run.status === "failed") return "Match scan could not complete";
  const found = run.matchedCompanyIds.length;
  if (found === 0) return "No new matches today";
  return `${plural(found, "company match", "company matches")} found`;
}

function scanDescription(run: MatchRun, inFlight: boolean): string {
  if (inFlight) return "Using your profile and current hiring signals";
  if (run.timedOut) return "The worker may still be processing this scan.";
  if (run.status === "failed") return "No changes were made to your profile.";
  return "Based on your saved preferences";
}

export function MatchScanRow({
  run,
  onRetry,
}: {
  run: MatchRun;
  onRetry: (runId: string) => void;
}) {
  const inFlight = isMatchInFlight(run);
  const error = !run.timedOut && run.status === "failed" ? run.error : null;
  const matches = run.status === "completed" ? run.matchedCompanyIds : [];

  return (
    <li className="px-2 py-3.5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-nest bg-surface-raised">
          <StatusIcon state={scanState(run, inFlight)} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-sans-semibold text-ink">{scanTitle(run, inFlight)}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{scanDescription(run, inFlight)}</p>
          {inFlight ? <MatchElapsedStatus startedAt={run.startedAt} /> : null}
          {run.timedOut ? (
            <div className="mt-3">
              <Button variant="quiet" size="sm" onClick={() => onRetry(run.id)}>
                Check status
              </Button>
            </div>
          ) : null}
          {error ? (
            <Notice boxed className="mt-3">
              {error}
            </Notice>
          ) : null}
          {matches.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {matches.map((companyId, index) => (
                <Link
                  key={companyId}
                  href={`/companies/${companyId}`}
                  className="rounded-full bg-signal-teal-subtle px-3 py-1.5 text-xs font-sans-semibold text-signal-teal transition-colors duration-fast hover:bg-signal-teal hover:text-surface"
                >
                  View match {index + 1}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}
