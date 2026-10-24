"use client";

import { useState } from "react";

import { ApiError, startMatchRun } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { followMatchRun, isMatchRunActive } from "@/lib/match-scan";
import type { MatchRunResult, PipelineRunStatus } from "@/lib/types";

export interface MatchRun {
  id: string;
  status: PipelineRunStatus;
  startedAt: number;
  error: string | null;
  matchedCompanyIds: string[];
  timedOut: boolean;
}

function failedRun(error: string): MatchRun {
  return {
    id: `local-${Date.now()}`,
    status: "failed",
    startedAt: Date.now(),
    error,
    matchedCompanyIds: [],
    timedOut: false,
  };
}

function fromResult(result: MatchRunResult): Partial<MatchRun> {
  return {
    status: result.status,
    error: result.error,
    matchedCompanyIds: result.matched_company_ids,
  };
}

/** Starts profile match scans and follows each until it settles or the poll
 * budget runs out, newest first. State lives with the caller, so leaving
 * the page drops the list (the backend run carries on regardless). */
export function useMatchScans() {
  const [matchBusy, setMatchBusy] = useState(false);
  const [matchRuns, setMatchRuns] = useState<MatchRun[]>([]);

  function settleMatch(runId: string, update: Partial<MatchRun>) {
    setMatchRuns((previous) =>
      previous.map((run) => (run.id === runId ? { ...run, ...update } : run)),
    );
  }

  async function followMatch(runId: string, token: string) {
    try {
      const settled = await followMatchRun(runId, token, {
        onPoll: (result) => settleMatch(runId, fromResult(result)),
      });
      if (!settled) settleMatch(runId, { timedOut: true });
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
    void followMatch(runId, token);
  }

  async function runMatch() {
    setMatchBusy(true);
    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setMatchRuns((previous) => [
          failedRun("Your session expired. Sign in again to run this."),
          ...previous,
        ]);
        return;
      }
      const initial = await startMatchRun(token);
      setMatchRuns((previous) => [
        {
          id: initial.id,
          status: initial.status,
          startedAt: Date.now(),
          error: initial.error,
          matchedCompanyIds: [],
          timedOut: false,
        },
        ...previous,
      ]);
      void followMatch(initial.id, token);
    } catch (error) {
      setMatchRuns((previous) => [
        failedRun(
          error instanceof ApiError
            ? error.message
            : "Something went wrong before the match could start.",
        ),
        ...previous,
      ]);
    } finally {
      setMatchBusy(false);
    }
  }

  return { matchBusy, matchRuns, runMatch, retryMatchPoll };
}

export function isMatchInFlight(run: MatchRun): boolean {
  return isMatchRunActive(run.status) && !run.timedOut;
}
