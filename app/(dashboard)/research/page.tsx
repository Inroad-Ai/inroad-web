"use client";

import Link from "next/link";
import { useState } from "react";

import { PageShell } from "@/components/composed/dashboard/PageShell";
import { SearchBar } from "@/components/composed/dashboard/SearchBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusDot } from "@/components/ui/StatusDot";
import { ApiError, getMatchRun, startMatchRun } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { useResearchRuns, type ResearchRun } from "@/lib/research-runs";
import type { CardState, PipelineRunStatus } from "@/lib/types";

interface MatchRun {
  id: string;
  status: PipelineRunStatus;
  error: string | null;
  matchedCompanyIds: string[];
  /** Gave up polling before reaching a terminal status - most likely the
   * background worker isn't running, not that the search is still going. */
  timedOut: boolean;
}

const MATCH_POLL_INTERVAL_MS = 3000;
// ~2 minutes: comfortably above the 17-38s a real match run has taken, but
// short enough that a dead worker doesn't leave this polling silently
// forever with nothing to show for it.
const MATCH_POLL_MAX_ATTEMPTS = 40;

export default function ResearchPage() {
  const [domain, setDomain] = useState("");
  const { runs, startResearch } = useResearchRuns();
  // One at a time in this box, same as before - startResearch itself has no
  // such limit, this is just the input's own UX.
  const busy = runs.some((r) => r.state === "pending");

  const [matchBusy, setMatchBusy] = useState(false);
  const [matchRuns, setMatchRuns] = useState<MatchRun[]>([]);

  function run(next: string) {
    setDomain(next);
    startResearch(next);
  }

  function settleMatch(runId: string, update: Partial<MatchRun>) {
    setMatchRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, ...update } : r)));
  }

  async function pollMatch(runId: string, token: string, attempt = 0) {
    try {
      const result = await getMatchRun(runId, token);
      settleMatch(runId, {
        status: result.status,
        error: result.error,
        matchedCompanyIds: result.matched_company_ids,
        timedOut: false,
      });
      if (result.status === "pending" || result.status === "running") {
        if (attempt + 1 >= MATCH_POLL_MAX_ATTEMPTS) {
          settleMatch(runId, { timedOut: true });
          return;
        }
        setTimeout(() => void pollMatch(runId, token, attempt + 1), MATCH_POLL_INTERVAL_MS);
      }
    } catch (error) {
      settleMatch(runId, {
        status: "failed",
        error: error instanceof ApiError ? error.message : "Lost track of this run's progress.",
      });
    }
  }

  async function retryMatchPoll(runId: string) {
    settleMatch(runId, { timedOut: false });
    const token = await ensureValidAccessToken();
    if (!token) {
      settleMatch(runId, {
        status: "failed",
        error: "Your session expired. Sign in again to check this.",
      });
      return;
    }
    void pollMatch(runId, token, 0);
  }

  async function runMatch() {
    setMatchBusy(true);
    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setMatchRuns((prev) => [
          {
            id: `local-${Date.now()}`,
            status: "failed",
            error: "Your session expired. Sign in again to run this.",
            matchedCompanyIds: [],
            timedOut: false,
          },
          ...prev,
        ]);
        return;
      }
      const initial = await startMatchRun(token);
      setMatchRuns((prev) => [
        {
          id: initial.id,
          status: initial.status,
          error: initial.error,
          matchedCompanyIds: [],
          timedOut: false,
        },
        ...prev,
      ]);
      void pollMatch(initial.id, token);
    } catch (error) {
      setMatchRuns((prev) => [
        {
          id: `local-${Date.now()}`,
          status: "failed",
          error:
            error instanceof ApiError
              ? error.message
              : "Something went wrong before the match could start.",
          matchedCompanyIds: [],
          timedOut: false,
        },
        ...prev,
      ]);
    } finally {
      setMatchBusy(false);
    }
  }

  return (
    <PageShell
      title="Research"
      description="Enter a company domain to research it, or find companies matching your own profile."
      action={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="sm:min-w-[26rem]">
            <SearchBar onRun={run} busy={busy} value={domain} />
          </div>
          <Button variant="quiet" onClick={runMatch} disabled={matchBusy} className="px-5 py-3.5">
            {matchBusy ? "Starting..." : "Job Run"}
          </Button>
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

      <div className="mt-6 rounded-md border border-line bg-surface shadow-card">
        <header className="flex items-baseline justify-between gap-3 border-b border-line px-6 py-4">
          <span className="utility-label text-text-secondary">Company matches</span>
          {matchRuns.length > 0 ? (
            <span className="utility-label text-text-secondary/60">{matchRuns.length}</span>
          ) : null}
        </header>

        {matchRuns.length === 0 ? (
          <EmptyState className="px-6 py-6">
            Nothing yet. Job Run searches for companies hiring for your target roles, matched
            against your profile.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {matchRuns.map((r) => (
              <li key={r.id}>
                <MatchRunRow run={r} onRetry={retryMatchPoll} />
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

function MatchRunRow({ run, onRetry }: { run: MatchRun; onRetry: (runId: string) => void }) {
  const inFlight = (run.status === "pending" || run.status === "running") && !run.timedOut;
  const dotState: CardState =
    run.timedOut || run.status === "failed" ? "failed" : inFlight ? "pending" : "done";

  return (
    <div className="px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <StatusDot state={dotState} />
          <span className="font-sans text-sm text-ink">
            {run.timedOut
              ? "Taking longer than expected"
              : inFlight
                ? "Searching for matches..."
                : run.status === "failed"
                  ? "Could not complete"
                  : run.matchedCompanyIds.length === 0
                    ? "Nothing matched today"
                    : `${run.matchedCompanyIds.length} ${
                        run.matchedCompanyIds.length === 1 ? "match" : "matches"
                      } found`}
          </span>
        </span>
      </div>

      {run.timedOut ? (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-sm text-text-secondary">
            This is taking longer than expected. The background worker may not be running.
          </p>
          <Button variant="quiet" onClick={() => onRetry(run.id)} className="px-4 py-2 text-xs">
            Check again
          </Button>
        </div>
      ) : null}

      {!run.timedOut && run.status === "failed" && run.error ? (
        <p className="mt-2 text-sm text-error">{run.error}</p>
      ) : null}

      {run.status === "completed" && run.matchedCompanyIds.length > 0 ? (
        <ul className="mt-3 space-y-1.5 pl-5">
          {run.matchedCompanyIds.map((companyId) => (
            <li key={companyId}>
              <Link
                href={`/companies/${companyId}`}
                className="text-sm text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
              >
                View company
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
