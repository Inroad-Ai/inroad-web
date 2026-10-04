import { readStorage, writeStorage } from "@/lib/browser-storage";

import { isThemePreference } from "./resolve-theme";
import { DEFAULT_THEME_PREFERENCE, THEME_STORAGE_KEY } from "./theme.constants";
import type { ThemePreference } from "./theme.types";

const listeners = new Set<() => void>();

// Blocked storage (private mode) cannot hold the choice, so keep it here for the session.
let sessionPreference: ThemePreference | null = null;

function notify() {
  listeners.forEach((listener) => listener());
}

export function getStoredPreference(): ThemePreference {
  const stored = readStorage(THEME_STORAGE_KEY);
  if (isThemePreference(stored)) return stored;
  return sessionPreference ?? DEFAULT_THEME_PREFERENCE;
}

export function getServerPreference(): ThemePreference {
  return DEFAULT_THEME_PREFERENCE;
}

export function setStoredPreference(preference: ThemePreference): void {
  sessionPreference = preference;
  writeStorage(THEME_STORAGE_KEY, preference);
  notify();
}

/** Also follows the `storage` event, so a change in another tab reaches this one. */
export function subscribeToPreference(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
