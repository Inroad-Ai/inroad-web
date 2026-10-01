import { readStorage, writeStorage } from "@/lib/browser-storage";

import { isThemePreference } from "./resolve-theme";
import { DEFAULT_THEME_PREFERENCE, THEME_STORAGE_KEY } from "./theme.constants";
import type { ThemePreference } from "./theme.types";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function getStoredPreference(): ThemePreference {
  const stored = readStorage(THEME_STORAGE_KEY);
  return isThemePreference(stored) ? stored : DEFAULT_THEME_PREFERENCE;
}

export function getServerPreference(): ThemePreference {
  return DEFAULT_THEME_PREFERENCE;
}

export function setStoredPreference(preference: ThemePreference): void {
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
