"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import { ensureValidAccessToken, SESSION_EXPIRED } from "@/lib/auth-native/browser";

interface UseAsyncResourceResult<T> {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  loading: boolean;
  error: string | null;
}

/** Shared shape behind useProfile/useConnections/useSettings/useOutreachDrafts:
 * fetch a token, load, and track loading/error state, aborting the in-flight
 * request if deps change or the component unmounts before it resolves.
 *
 * `load` receives the token and an AbortSignal to pass through to the
 * api-client call; deps mirrors useEffect's own dependency list, so a hook
 * that reloads on a changing id (useOutreachDrafts) passes that id here. */
export function useAsyncResource<T>(
  initial: T,
  load: (token: string, signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
  /** A plain fallback message, or a mapper for a hook that needs to
   * recognize a specific error (see useOutreachDrafts' profile_not_found
   * case) before falling back to caught.message. */
  onFailure: string | ((caught: unknown) => string),
): UseAsyncResourceResult<T> {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          setError(SESSION_EXPIRED);
          return;
        }
        setData(await load(token, controller.signal));
      } catch (caught) {
        if (controller.signal.aborted) return;
        if (typeof onFailure === "function") {
          setError(onFailure(caught));
        } else {
          setError(caught instanceof Error ? caught.message : onFailure);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void run();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, setData, loading, error };
}
