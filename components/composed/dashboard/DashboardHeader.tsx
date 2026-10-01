"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/IconButton";
import { StatusDot } from "@/components/ui/StatusDot";
import { useResearchRuns } from "@/lib/research-runs";

import { getPageTitle } from "./nav/nav-utils";

export function DashboardHeader({ onOpenNav }: { onOpenNav: () => void }) {
  const pathname = usePathname();
  const { runs } = useResearchRuns();
  const pendingCount = runs.filter((r) => r.state === "pending").length;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-line bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <IconButton label="Open navigation" onClick={onOpenNav} className="lg:hidden">
          <MenuIcon />
        </IconButton>
        <span className="truncate font-display text-lg text-ink">{getPageTitle(pathname)}</span>
      </div>
      {pendingCount > 0 ? (
        <Link
          href="/research"
          className="utility-label flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1.5 text-text-secondary transition-colors hover:border-signal-teal hover:text-signal-teal"
        >
          <StatusDot state="pending" />
          Researching {pendingCount > 1 ? `${pendingCount} companies` : "1 company"}...
        </Link>
      ) : null}
    </header>
  );
}
