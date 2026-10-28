"use client";

import { usePathname } from "next/navigation";

import { AccountMenu } from "@/components/composed/dashboard/AccountMenu";
import { NotificationBell } from "@/components/composed/dashboard/NotificationBell";
import { ResearchStatusPill } from "@/components/composed/dashboard/ResearchStatusPill";
import { ThemeMenu } from "@/components/composed/dashboard/ThemeMenu";
import { ChevronIcon, MenuIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/IconButton";
import type { Profile } from "@/lib/api-client/client";

import { CommandPaletteTrigger } from "./command-palette/CommandPaletteTrigger";
import { getPageTitle } from "./nav/nav-utils";

export function DashboardHeader({
  onOpenNav,
  onOpenPalette,
  profile,
}: {
  onOpenNav: () => void;
  onOpenPalette: () => void;
  profile: Profile | null;
}) {
  const title = getPageTitle(usePathname());

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-paper/90 px-page backdrop-blur">
      <IconButton label="Open navigation" onClick={onOpenNav} className="lg:hidden">
        <MenuIcon />
      </IconButton>
      <p className="flex min-w-0 flex-1 items-center gap-2 text-sm font-sans-semibold">
        <span className="hidden text-ink-muted sm:inline">Inroad</span>
        <span aria-hidden className="hidden text-ink-faint sm:inline">
          <ChevronIcon isFlipped />
        </span>
        <span className="truncate text-ink">{title}</span>
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <ResearchStatusPill />
        <CommandPaletteTrigger onOpen={onOpenPalette} />
        <NotificationBell />
        <ThemeMenu />
        <AccountMenu profile={profile} />
      </div>
    </header>
  );
}
