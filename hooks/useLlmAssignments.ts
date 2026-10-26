"use client";

import { fetchLlmAssignments, type LlmAssignment } from "@/lib/api-client/client";
import { useAsyncResource } from "@/hooks/useAsyncResource";

interface UseLlmAssignmentsResult {
  assignments: LlmAssignment[];
  /** set/clear return the new list, so saves update without a refetch -
   * same convention as useConnections' setConnections. */
  setAssignments: (assignments: LlmAssignment[]) => void;
  loading: boolean;
  error: string | null;
}

export function useLlmAssignments(): UseLlmAssignmentsResult {
  const { data, setData, loading, error } = useAsyncResource<LlmAssignment[]>(
    [],
    (token, signal) => fetchLlmAssignments(token, signal),
    [],
    "Could not load your model settings.",
  );

  return { assignments: data, setAssignments: setData, loading, error };
}
