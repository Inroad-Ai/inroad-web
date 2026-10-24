"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { SearchIcon, SignOutIcon } from "@/components/ui/Icons";
import { THEME_OPTIONS } from "@/components/ui/ThemeToggle";
import { useSignOut } from "@/hooks/useSignOut";
import { useTheme } from "@/hooks/useTheme";

import { NAV_SECTIONS } from "../nav/nav.constants";
import type { PaletteCommand } from "./palette.types";

/** Every app page, plus the actions that make sense from anywhere. */
export function usePaletteCommands(): PaletteCommand[] {
  const router = useRouter();
  const { preference, setPreference } = useTheme();
  const { signOut } = useSignOut();

  return useMemo(() => {
    const pages: PaletteCommand[] = NAV_SECTIONS.flatMap((section) =>
      section.items.map(({ href, label, icon: Icon }) => ({
        id: `go:${href}`,
        group: "Go to",
        label,
        hint: section.label,
        icon: <Icon />,
        run: () => router.push(href),
      })),
    );

    const themes: PaletteCommand[] = THEME_OPTIONS.map(({ value, label, Icon }) => ({
      id: `theme:${value}`,
      group: "Actions",
      label: `Use ${label.toLowerCase()} theme`,
      hint: value === preference ? "Current" : undefined,
      icon: <Icon />,
      run: () => setPreference(value),
    }));

    return [
      ...pages,
      {
        id: "action:research",
        group: "Actions",
        label: "Research a company",
        hint: "Paste a domain",
        icon: <SearchIcon />,
        run: () => router.push("/research"),
      },
      ...themes,
      {
        id: "action:sign-out",
        group: "Actions",
        label: "Sign out",
        icon: <SignOutIcon />,
        run: () => void signOut(),
      },
    ];
  }, [router, preference, setPreference, signOut]);
}
