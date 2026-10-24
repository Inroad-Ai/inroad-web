"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

/** The theme toggle wired to the stored preference. */
export function ThemeControl({ compact = false }: { compact?: boolean }) {
  const { preference, setPreference } = useTheme();
  return <ThemeToggle value={preference} onChange={setPreference} compact={compact} />;
}
