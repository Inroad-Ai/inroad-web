"use client";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { applyTheme } from "@/lib/theme/apply-theme";
import { resolveTheme } from "@/lib/theme/resolve-theme";
import { DARK_MEDIA_QUERY } from "@/lib/theme/theme.constants";
import { getStoredPreference, subscribeToPreference } from "@/lib/theme/theme-store";

/** Keeps the page's theme attribute in step with the stored preference and the
 * OS setting on every route. Reads live values instead of render snapshots so
 * the first client render cannot undo what the init script already set. */
export function ThemeSync() {
  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia(DARK_MEDIA_QUERY);
    const sync = () => applyTheme(resolveTheme(getStoredPreference(), query.matches));

    sync();
    const unsubscribe = subscribeToPreference(sync);
    query.addEventListener("change", sync);

    return () => {
      unsubscribe();
      query.removeEventListener("change", sync);
    };
  }, []);

  return null;
}
