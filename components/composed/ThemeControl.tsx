"use client";

import { ThemeCycleButton, ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

/** The theme control wired to the stored preference: the full Light / Dark /
 * System control, or with `compact` a single button that cycles through them. */
export function ThemeControl({ compact = false }: { compact?: boolean }) {
  const { preference, setPreference } = useTheme();
  if (compact) return <ThemeCycleButton value={preference} onChange={setPreference} />;
  return <ThemeToggle value={preference} onChange={setPreference} />;
}
