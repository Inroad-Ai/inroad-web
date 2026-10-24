"use client";

import Link from "next/link";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { useResearchRuns } from "@/lib/research-runs";

export function ResearchStatusPill() {
  const { runs } = useResearchRuns();
  const pendingCount = runs.filter((r) => r.state === "pending").length;

  if (pendingCount === 0) return null;

  return (
    <Link
      href="/research"
      className="hidden h-10 shrink-0 items-center rounded-full bg-signal-amber-subtle px-4 transition-colors duration-fast hover:bg-signal-amber-subtle/70 md:inline-flex"
    >
      <Eyebrow as="span" dot="live">
        Researching {pendingCount > 1 ? `${pendingCount} companies` : "1 company"}
      </Eyebrow>
    </Link>
  );
}
