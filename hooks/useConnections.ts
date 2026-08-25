"use client";

import { useEffect, useState } from "react";

import { fetchConnections, type Connection } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";

interface UseConnectionsResult {
  connections: Connection[];
  /** save/delete return the new state directly, so this updates without a
   * refetch - same convention as useProfile's setProfile. */
  setConnections: (connections: Connection[]) => void;
  loading: boolean;
  error: string | null;
}

export function useConnections(): UseConnectionsResult {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          if (!cancelled) setError("Your session expired. Sign in again.");
          return;
        }

        const loaded = await fetchConnections(token);
        if (!cancelled) setConnections(loaded);
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Could not load your connections.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { connections, setConnections, loading, error };
}
