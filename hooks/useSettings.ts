"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchSettings,
  updateSettings,
  type FollowUpCadence,
  type UserSettings,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";

interface UseSettingsResult {
  settings: UserSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  update: (cadence: FollowUpCadence) => Promise<void>;
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

        const loaded = await fetchSettings(token);
        if (!cancelled) setSettings(loaded);
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Could not load your settings.");
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

  const update = useCallback(async (cadence: FollowUpCadence) => {
    setSaving(true);
    setError(null);
    try {
      const token = await ensureValidAccessToken();
      if (!token) throw new Error("Your session expired. Sign in again.");
      setSettings(await updateSettings(cadence, token));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your settings.");
    } finally {
      setSaving(false);
    }
  }, []);

  return { settings, loading, saving, error, update };
}
