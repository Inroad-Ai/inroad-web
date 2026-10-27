"use client";

import { useCallback, useState } from "react";

import {
  ApiError,
  fetchOutreachDrafts,
  startOutreachDraftRun,
  type OutreachDraft,
} from "@/lib/api-client/client";
import { followOutreachDraftRun } from "@/lib/outreach-draft-run";
import { requireAccessToken } from "@/lib/auth-native/browser";
import { useAsyncResource } from "@/hooks/useAsyncResource";

/** The backend's own message is the one to show for most of these - it says
 * what to do next. profile_not_found is the exception: "No profile yet for
 * this account" is true but doesn't explain why drafting needed it. */
function describe(caught: unknown): string {
  if (caught instanceof ApiError && caught.code === "profile_not_found") {
    return "Finish your profile first. The draft is written from your resume and target roles.";
  }
  if (caught instanceof Error) return caught.message;
  return "Could not draft outreach for this person.";
}

/** A failed run carries an error code, not an ApiError, so map the two the
 * job can end on to the same guidance describe() gives their synchronous
 * cousins. Everything else is already a next-step message from the backend. */
function describeRunError(code: string | null): string {
  if (code === "profile_not_found") {
    return "Finish your profile first. The draft is written from your resume and target roles.";
  }
  if (code === "company_context_missing") {
    return "This company has no research yet. Open the company and run research, then draft again.";
  }
  return "Could not draft outreach for this person.";
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

  const draft = useCallback(
    async (sequenceIndex = 0) => {
      setDrafting(true);
      setDraftError(null);
      try {
        const token = await requireAccessToken();
        // The POST only enqueues; the drafts arrive by polling the run.
        const started = await startOutreachDraftRun(personId, sequenceIndex, token);
        const run = await followOutreachDraftRun(personId, started.id, token);
        if (run === null) {
          setDraftError("Still drafting. Give it a moment, then refresh this page.");
          return;
        }
        if (run.status === "failed") {
          setDraftError(describeRunError(run.error));
          return;
        }
        setDrafts((current) => mergeDrafts(current, run.drafts));
      } catch (caught) {
        setDraftError(describe(caught));
      } finally {
        setDrafting(false);
      }
    },
    [personId, setDrafts],
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
