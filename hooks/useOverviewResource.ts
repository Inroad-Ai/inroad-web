"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { clearTokens, ensureValidAccessToken } from "@/lib/auth-native/browser";
import { ApiError } from "@/lib/api-client/client";
import { SESSION_EXPIRED } from "@/hooks/useAsyncResource";

export function useOverviewResource<T>(load: (token: string, signal: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const controller = useRef<AbortController | null>(null);

  const retry = useCallback(async () => {
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    setLoading(true);
    setError(null);

    try {
      const token = await ensureValidAccessToken();
      if (next.signal.aborted) return;
      if (!token) {
        setError(SESSION_EXPIRED);
        return;
      }
      const result = await load(token, next.signal);
      if (next.signal.aborted) return;
      setData(result);
      setUpdatedAt(new Date());
    } catch (caught) {
      if (next.signal.aborted) return;
      if (caught instanceof ApiError && caught.status === 401) {
        clearTokens();
        setError(SESSION_EXPIRED);
      } else {
        setError("Could not load this section. Try again.");
      }
    } finally {
      if (!next.signal.aborted) setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void retry();
    function onFocus() {
      void retry();
    }
    window.addEventListener("focus", onFocus);
    return () => {
      controller.current?.abort();
      window.removeEventListener("focus", onFocus);
    };
  }, [retry]);

  return { data, loading, error, updatedAt, retry };
}
