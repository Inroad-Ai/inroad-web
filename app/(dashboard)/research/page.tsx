"use client";

import Link from "next/link";
import { useState } from "react";

import { PageShell } from "@/components/composed/dashboard/PageShell";
import { SearchBar } from "@/components/composed/dashboard/SearchBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusDot } from "@/components/ui/StatusDot";
import {
  ApiError,
  getMatchRun,
  researchCompanyDomain,
  startMatchRun,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { CardState, PipelineRunStatus } from "@/lib/types";

interface Run {
  id: number;
  domain: string;
  state: CardState;
  companyId: string | null;
  error: string | null;
}

interface MatchRun {
  id: string;
  status: PipelineRunStatus;
  error: string | null;
  matchedCompanyIds: string[];
}

let nextRunId = 0;

const MATCH_POLL_INTERVAL_MS = 3000;

export default function ResearchPage() {
  const [domain, setDomain] = useState("");
  const [busy, setBusy] = useState(false);
  const [runs, setRuns] = useState<Run[]>([]);

  const [matchBusy, setMatchBusy] = useState(false);
  const [matchRuns, setMatchRuns] = useState<MatchRun[]>([]);

  async function run(next: string) {
    setDomain(next);
    setBusy(true);

    const id = nextRunId++;
    setRuns((prev) => [
      { id, domain: next, state: "pending", companyId: null, error: null },
      ...prev,
    ]);

    function settle(update: Partial<Run>) {
      setRuns((prev) => prev.map((r) => (r.id === id ? { ...r, ...update } : r)));
    }

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        settle({ state: "failed", error: "Your session expired. Sign in again to run this." });
        return;
      }
      const company = await researchCompanyDomain(next, token);
      settle({ state: "done", companyId: company.id });
    } catch (error) {
      settle({
        state: "failed",
        error:
          error instanceof ApiError
            ? error.message
            : "Something went wrong before the check could run.",
      });
    } finally {
      setBusy(false);
    }
  }

  function settleMatch(runId: string, update: Partial<MatchRun>) {
    setMatchRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, ...update } : r)));
  }

  async function pollMatch(runId: string, token: string) {
    try {
      const result = await getMatchRun(runId, token);
      settleMatch(runId, {
        status: result.status,
        error: result.error,
        matchedCompanyIds: result.matched_company_ids,
      });
      if (result.status === "pending" || result.status === "running") {
        setTimeout(() => void pollMatch(runId, token), MATCH_POLL_INTERVAL_MS);
      }
    } catch (error) {
      settleMatch(runId, {
        status: "failed",
        error:
          error instanceof ApiError ? error.message : "Lost track of this run's progress.",
      });
    }
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
                <MatchRunRow run={r} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

function RunRow({ run }: { run: Run }) {
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

function MatchRunRow({ run }: { run: MatchRun }) {
  const inFlight = run.status === "pending" || run.status === "running";
  const dotState: CardState = inFlight ? "pending" : run.status === "failed" ? "failed" : "done";

  return (
    <div className="px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <StatusDot state={dotState} />
          <span className="font-sans text-sm text-ink">
            {inFlight
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

      {run.status === "failed" && run.error ? (
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
