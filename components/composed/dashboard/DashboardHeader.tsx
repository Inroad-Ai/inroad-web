"use client";

import { usePathname } from "next/navigation";

import { AccountMenu } from "@/components/composed/dashboard/AccountMenu";
import { ResearchStatusPill } from "@/components/composed/dashboard/ResearchStatusPill";
import { MenuIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/IconButton";

import { getPageTitle } from "./nav/nav-utils";

export function DashboardHeader({ onOpenNav }: { onOpenNav: () => void }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-line bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <IconButton label="Open navigation" onClick={onOpenNav} className="lg:hidden">
          <MenuIcon />
        </IconButton>
        <span className="truncate font-display text-lg text-ink">{getPageTitle(pathname)}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <ResearchStatusPill />
        <AccountMenu />
      </div>
    </header>
  );
}
