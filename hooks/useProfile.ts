"use client";

import { fetchProfile, type Profile } from "@/lib/api-client/client";
import { useAsyncResource } from "@/hooks/useAsyncResource";

interface UseProfileResult {
  profile: Profile | null;
  /** For a caller that saves: saveProfile returns the new row, and this
   * keeps the hook's copy in step without a refetch. */
  setProfile: (profile: Profile) => void;
  loading: boolean;
  error: string | null;
}

/** A null profile with no error means onboarding was never finished, which
 * callers route on. It is not a failure. */
export function useProfile(): UseProfileResult {
  const { data, setData, loading, error } = useAsyncResource<Profile | null>(
    null,
    (token, signal) => fetchProfile(token, signal),
    [],
    "Could not load your profile.",
  );

  return { profile: data, setProfile: setData, loading, error };
}
