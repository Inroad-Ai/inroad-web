import type { ThemePreference } from "./theme.types";

export const THEME_STORAGE_KEY = "inroad:theme";

export const THEME_ATTRIBUTE = "data-theme";

export const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

export const THEME_PREFERENCES: readonly ThemePreference[] = ["light", "dark", "system"];
