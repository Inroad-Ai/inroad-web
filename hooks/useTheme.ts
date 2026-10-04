"use client";

import { useSyncExternalStore } from "react";

import { resolveTheme } from "@/lib/theme/resolve-theme";
import {
  getServerPreference,
  getStoredPreference,
  setStoredPreference,
  subscribeToPreference,
} from "@/lib/theme/theme-store";

import { useSystemPrefersDark } from "./useSystemPrefersDark";

export function useTheme() {
  const preference = useSyncExternalStore(
    subscribeToPreference,
    getStoredPreference,
    getServerPreference,
  );
  const systemPrefersDark = useSystemPrefersDark();

  return {
    preference,
    resolved: resolveTheme(preference, systemPrefersDark),
    setPreference: setStoredPreference,
  };
}
