"use client";

import { useCallback, useState } from "react";

import {
  fetchSettings,
  updateSettings,
  type FollowUpCadence,
  type UserSettings,
} from "@/lib/api-client/client";
import { requireAccessToken } from "@/lib/auth-native/browser";
import { useAsyncResource } from "@/hooks/useAsyncResource";

interface UseSettingsResult {
  settings: UserSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  update: (cadence: FollowUpCadence) => Promise<void>;
}

export function useSettings(): UseSettingsResult {
  const {
    data: settings,
    setData: setSettings,
    loading,
    error: loadError,
  } = useAsyncResource<UserSettings | null>(
    null,
    (token, signal) => fetchSettings(token, signal),
    [],
    "Could not load your settings.",
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const update = useCallback(
    async (cadence: FollowUpCadence) => {
      setSaving(true);
      setSaveError(null);
      try {
        const token = await requireAccessToken();
        setSettings(await updateSettings(cadence, token));
      } catch (caught) {
        setSaveError(caught instanceof Error ? caught.message : "Could not save your settings.");
      } finally {
        setSaving(false);
      }
    },
    [setSettings],
  );

  return { settings, loading, saving, error: saveError ?? loadError, update };
}
