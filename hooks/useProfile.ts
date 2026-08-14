"use client";

import { useEffect, useState } from "react";

import { fetchProfile, type Profile } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";

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
  const [profile, setProfile] = useState<Profile | null>(null);
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

        const loaded = await fetchProfile(token);
        if (!cancelled) setProfile(loaded);
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Could not load your profile.");
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

  return { profile, setProfile, loading, error };
}
