"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { followLatestMatchRun, isMatchRunActive } from "@/lib/match-scan";
import type { MatchRunResult } from "@/lib/types";
import { Notice } from "@/components/ui/Notice";

type Progress =
  | { state: "idle" }
  | { state: "researching"; done: number; total: number }
  | { state: "ready"; total: number };

function progressOf(run: MatchRunResult): Progress {
  const total = run.matched_company_ids.length;
  if (total === 0) return { state: "idle" };
  if (isMatchRunActive(run.status)) {
    return { state: "researching", done: run.researched_company_ids.length, total };
  }
  return { state: "ready", total };
}

/** Follows the newest match run while its companies are being researched,
 * and says when they are all done. `onResearched` fires each time another
 * company's research lands, so the list can refresh. */
export function MatchProgressNotice({ onResearched }: { onResearched: () => void }) {
  const [progress, setProgress] = useState<Progress>({ state: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    let seen = -1;
    let followed = false;

    async function follow() {
      const token = await ensureValidAccessToken();
      if (!token) return;
      await followLatestMatchRun(token, {
        signal: controller.signal,
        onPoll: (run) => {
          const next = progressOf(run);
          // A run that was already finished when the page opened is old news.
          if (next.state === "ready" && !followed) return;
          followed = followed || next.state === "researching";
          const done = run.researched_company_ids.length;
          if (seen >= 0 && done !== seen) onResearched();
          seen = done;
          setProgress(next);
        },
      });
    }

    follow().catch((error: unknown) => {
      // No match run yet (404) or a lost poll: the notice just stays hidden.
      if (!(error instanceof ApiError) && !controller.signal.aborted) throw error;
    });
    return () => controller.abort();
  }, [onResearched]);

  if (progress.state === "researching") {
    return (
      <Notice tone="neutral" boxed>
        Researching your matches: {progress.done} of {progress.total} done. Each one fills in here
        as it finishes.
      </Notice>
    );
  }
  if (progress.state === "ready") {
    return (
      <Notice tone="success" boxed>
        {progress.total === 1
          ? "Your match is researched."
          : `All ${progress.total} matches are researched.`}
      </Notice>
    );
  }
  return null;
}
