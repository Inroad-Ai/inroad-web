"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { StatusDot } from "@/components/ui/StatusDot";
import { useResearchRuns } from "@/lib/research-runs";

const TITLES: Record<string, string> = {
  "/overview": "Overview",
  "/profile": "Profile",
  "/research": "Research",
  "/companies/pipeline": "Pipeline",
  "/companies": "Companies",
  "/settings": "Settings",
};

function pageTitle(pathname: string | null): string {
  if (!pathname) return "";
  // Longest prefix first, so "/companies/pipeline" wins over "/companies".
  const match = Object.keys(TITLES)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname.startsWith(prefix));
  return match ? TITLES[match] : "";
}

export function DashboardHeader() {
  const pathname = usePathname();
  const { runs } = useResearchRuns();
  const pendingCount = runs.filter((r) => r.state === "pending").length;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-surface px-6">
      <span className="font-display text-lg text-ink">{pageTitle(pathname)}</span>
      {pendingCount > 0 ? (
        <Link
          href="/research"
          className="utility-label flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-text-secondary transition-colors hover:border-signal-teal hover:text-signal-teal"
        >
          <StatusDot state="pending" />
          Researching {pendingCount > 1 ? `${pendingCount} companies` : "1 company"}...
        </Link>
      ) : null}
    </header>
  );
}
