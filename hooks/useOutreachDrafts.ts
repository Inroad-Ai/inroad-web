"use client";

import { useCallback, useEffect, useState } from "react";

import {
  ApiError,
  draftOutreach,
  fetchOutreachDrafts,
  type OutreachDraft,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";

const SESSION_EXPIRED = "Your session expired. Sign in again.";

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

interface UseOutreachDraftsResult {
  drafts: OutreachDraft[];
  /** The one-off load of drafts written in an earlier session. */
  loading: boolean;
  drafting: boolean;
  error: string | null;
  draft: () => Promise<void>;
  /** A saved edit returns the new row, so this updates without a refetch -
   * same convention as useConnections' setConnections. */
  replaceDraft: (draft: OutreachDraft) => void;
}

export function useOutreachDrafts(personId: string): UseOutreachDraftsResult {
  const [drafts, setDrafts] = useState<OutreachDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          setError(SESSION_EXPIRED);
          return;
        }
        setDrafts(await fetchOutreachDrafts(personId, token, controller.signal));
      } catch (caught) {
        if (controller.signal.aborted) return;
        setError(describe(caught));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [personId]);

  const draft = useCallback(async () => {
    setDrafting(true);
    setError(null);
    try {
      const token = await ensureValidAccessToken();
      if (!token) throw new Error(SESSION_EXPIRED);
      setDrafts(await draftOutreach(personId, token));
    } catch (caught) {
      setError(describe(caught));
    } finally {
      setDrafting(false);
    }
  }, [personId]);

  const replaceDraft = useCallback((updated: OutreachDraft) => {
    setDrafts((current) =>
      current.map((existing) => (existing.id === updated.id ? updated : existing)),
    );
  }, []);

  return { drafts, loading, drafting, error, draft, replaceDraft };
}
