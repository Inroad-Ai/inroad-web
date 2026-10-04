"use client";

import Link from "next/link";

import { StatusDot } from "@/components/ui/StatusDot";
import { useResearchRuns } from "@/lib/research-runs";

export function ResearchStatusPill() {
  const { runs } = useResearchRuns();
  const pendingCount = runs.filter((r) => r.state === "pending").length;

  if (pendingCount === 0) return null;

  return (
    <Link
      href="/research"
      className="utility-label hidden shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1.5 text-text-secondary transition-colors hover:border-signal-teal hover:text-signal-teal sm:flex"
    >
      <StatusDot state="pending" />
      Researching {pendingCount > 1 ? `${pendingCount} companies` : "1 company"}...
    </Link>
  );
}
