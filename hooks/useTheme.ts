"use client";

import { useSyncExternalStore } from "react";

import { resolveTheme } from "@/lib/theme/resolve-theme";
import {
  getServerPreference,
  getStoredPreference,
  setStoredPreference,
  subscribeToPreference,
} from "@/lib/theme/theme-store";
import type { ResolvedTheme, ThemePreference } from "@/lib/theme/theme.types";

import { useSystemPrefersDark } from "./useSystemPrefersDark";

interface ThemeState {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

/** The one place a component reads or changes the theme; ThemeSync applies it. */
export function useTheme(): ThemeState {
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
