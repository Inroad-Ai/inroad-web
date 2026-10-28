"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  ApiError,
  fetchActiveOutreachDraftRuns,
  fetchOutreachDrafts,
  startOutreachDraftRun,
  type OutreachDraft,
} from "@/lib/api-client/client";
import { followOutreachDraftRun } from "@/lib/outreach-draft-run";
import { requireAccessToken } from "@/lib/auth-native/browser";
import { useAsyncResource } from "@/hooks/useAsyncResource";

const DEFAULT_ERROR = "Could not draft outreach for this person.";

// Codes whose backend message is true but doesn't say what drafting needs.
const GUIDANCE: Record<string, string> = {
  profile_not_found:
    "Finish your profile first. The draft is written from your resume and target roles.",
  company_context_missing:
    "This company has no research yet. Open the company and run research, then draft again.",
};

/** The backend's own message is the one to show for most failures, from a
 * request or a failed run alike: it says what to do next. */
function messageFor(code: string | null | undefined, message: string | null | undefined): string {
  return (code ? GUIDANCE[code] : undefined) ?? message ?? DEFAULT_ERROR;
}

function describe(caught: unknown): string {
  if (caught instanceof ApiError) return messageFor(caught.code, caught.message);
  if (caught instanceof Error) return caught.message;
  return DEFAULT_ERROR;
}

export interface UseOutreachDraftsResult {
  drafts: OutreachDraft[];
  /** The one-off load of drafts written in an earlier session. */
  loading: boolean;
  drafting: boolean;
  error: string | null;
  /** sequenceIndex 0 (the default) is the initial message; higher drafts a
   * follow-up, which the backend requires the previous one to exist for. */
  draft: (sequenceIndex?: number) => Promise<void>;
  /** A saved edit returns the new row, so this updates without a refetch -
   * same convention as useConnections' setConnections. */
  replaceDraft: (draft: OutreachDraft) => void;
}

/** Drafting one sequence position returns just that position's two rows,
 * not the whole set, so the response replaces only the rows it covers and
 * leaves every other sequence position where it was. */
function mergeDrafts(current: OutreachDraft[], updated: OutreachDraft[]): OutreachDraft[] {
  const isReplaced = (draft: OutreachDraft) =>
    updated.some(
      (next) => next.channel === draft.channel && next.sequence_index === draft.sequence_index,
    );
  return [...current.filter((draft) => !isReplaced(draft)), ...updated];
}

export function useOutreachDrafts(personId: string): UseOutreachDraftsResult {
  const {
    data: drafts,
    setData: setDrafts,
    loading,
    error: loadError,
  } = useAsyncResource<OutreachDraft[]>(
    [],
    (token, signal) => fetchOutreachDrafts(personId, token, signal),
    [personId],
    describe,
  );
  const [drafting, setDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  // The run being followed; aborted when another starts or the page unmounts.
  const following = useRef<AbortController | null>(null);

  useEffect(() => () => following.current?.abort(), []);

  const follow = useCallback(
    async (runId: string, token: string) => {
      following.current?.abort();
      const controller = new AbortController();
      following.current = controller;
      setDrafting(true);
      setDraftError(null);
      try {
        const run = await followOutreachDraftRun(personId, runId, token, {
          signal: controller.signal,
        });
        if (run === null) {
          setDraftError("Still drafting. Give it a moment, then refresh this page.");
        } else if (run.status === "failed") {
          setDraftError(messageFor(run.error_code, run.error));
        } else {
          setDrafts((current) => mergeDrafts(current, run.drafts));
        }
      } catch (caught) {
        if (!controller.signal.aborted) setDraftError(describe(caught));
      } finally {
        if (following.current === controller) setDrafting(false);
      }
    },
    [personId, setDrafts],
  );

  // A page opened or reloaded mid-draft keeps following the run in flight.
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const token = await requireAccessToken();
        const [active] = await fetchActiveOutreachDraftRuns(personId, token, controller.signal);
        if (active && !controller.signal.aborted) await follow(active.id, token);
      } catch {
        // Nothing to resume: the page shows the saved drafts, as it would anyway.
      }
    })();
    return () => controller.abort();
  }, [personId, follow]);

  const draft = useCallback(
    async (sequenceIndex = 0) => {
      setDrafting(true);
      setDraftError(null);
      try {
        const token = await requireAccessToken();
        const started = await startOutreachDraftRun(personId, sequenceIndex, token);
        await follow(started.id, token);
      } catch (caught) {
        setDraftError(describe(caught));
        setDrafting(false);
      }
    },
    [personId, follow],
  );

  const replaceDraft = useCallback(
    (updated: OutreachDraft) => {
      setDrafts((current) =>
        current.map((existing) => (existing.id === updated.id ? updated : existing)),
      );
    },
    [setDrafts],
  );

  return { drafts, loading, drafting, error: draftError ?? loadError, draft, replaceDraft };
}
