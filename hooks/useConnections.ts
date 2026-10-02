"use client";

import { fetchConnections, type Connection } from "@/lib/api-client/client";
import { useAsyncResource } from "@/hooks/useAsyncResource";

interface UseConnectionsResult {
  connections: Connection[];
  /** save/delete return the new state directly, so this updates without a
   * refetch - same convention as useProfile's setProfile. */
  setConnections: (connections: Connection[]) => void;
  loading: boolean;
  error: string | null;
}

export function useConnections(): UseConnectionsResult {
  const { data, setData, loading, error } = useAsyncResource<Connection[]>(
    [],
    (token, signal) => fetchConnections(token, signal),
    [],
    "Could not load your connections.",
  );

  return { connections: data, setConnections: setData, loading, error };
}
