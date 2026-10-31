"use client";

import { useEffect, useState } from "react";

import { ApiError, fetchCompany, startMatchRun } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { followMatchRun } from "@/lib/match-scan";

const MAX_SHOWN_MATCHES = 5;

export interface MatchedCompany {
  id: string;
  domain: string;
  logoUrl: string | null;
  roleTitle: string | null;
}

export type FirstMatchScan =
  | { status: "searching"; startedAt: number }
  | { status: "matched"; total: number; companies: MatchedCompany[] }
  | { status: "empty" }
  | { status: "timedOut" }
  | { status: "failed"; message: string };

async function loadMatches(ids: string[], token: string, signal: AbortSignal) {
  const results = await Promise.allSettled(
    ids.slice(0, MAX_SHOWN_MATCHES).map((id) => fetchCompany(id, token, signal)),
  );
  return results.flatMap((result): MatchedCompany[] =>
    result.status === "fulfilled"
      ? [
          {
            id: result.value.id,
            domain: result.value.domain,
            logoUrl: result.value.logo_url,
            roleTitle: result.value.matched_role_title,
          },
        ]
      : [],
  );
}

/** Starts the profile match scan once the profile is saved and follows it
 * until the first matches are saved; their research carries on in the
 * background and the Companies page shows it landing. */
export function useFirstMatchScan(): FirstMatchScan {
  const [scan, setScan] = useState<FirstMatchScan>(() => ({
    status: "searching",
    startedAt: Date.now(),
  }));

  useEffect(() => {
    // startMatchRun reuses a run already in flight, so React's development
    // double-invoke attaches to the same scan rather than starting a second one.
    const controller = new AbortController();
    const { signal } = controller;

    async function run(): Promise<FirstMatchScan> {
      const token = await ensureValidAccessToken();
      if (!token)
        return { status: "failed", message: "Your session expired. Sign in again to run this." };

      const started = await startMatchRun(token, signal);
      const result = await followMatchRun(started.id, token, {
        signal,
        until: (run) => run.matched_company_ids.length > 0,
      });
      if (!result) return { status: "timedOut" };
      if (result.status === "failed") {
        return { status: "failed", message: result.error ?? "The match scan could not complete." };
      }
      const ids = result.matched_company_ids;
      if (ids.length === 0) return { status: "empty" };
      return {
        status: "matched",
        total: ids.length,
        companies: await loadMatches(ids, token, signal),
      };
    }

    run()
      .then((result) => {
        if (!signal.aborted) setScan(result);
      })
      .catch((error: unknown) => {
        if (signal.aborted) return;
        setScan({
          status: "failed",
          message:
            error instanceof ApiError
              ? error.message
              : "Something went wrong before the match could start.",
        });
      });

    return () => controller.abort();
  }, []);

  return scan;
}
