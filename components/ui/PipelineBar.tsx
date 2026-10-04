import Link from "next/link";

import type { PipelineStage } from "@/lib/types";

const BAR_TONES: Record<PipelineStage, string> = {
  researched: "bg-text-secondary",
  contacted: "bg-signal-teal",
  responded: "bg-signal-teal",
  interviewing: "bg-success",
  closed: "bg-warning",
  rejected: "bg-muted-rose",
};

export function PipelineBar({
  stage,
  label,
  count,
  max,
  href,
}: {
  stage: PipelineStage;
  label: string;
  count: number;
  max: number;
  href: string;
}) {
  return (
    <Link href={href} className="block rounded-sm p-2 hover:bg-surface-raised">
      <span className="flex items-center justify-between gap-3 text-sm text-ink">
        <span>{label}</span>
        <span className="font-semibold">{count}</span>
      </span>
      <span
        aria-hidden="true"
        className="mt-2 block h-2 overflow-hidden rounded-full bg-surface-raised"
      >
        <span
          className={`block h-full rounded-full ${BAR_TONES[stage]}`}
          style={{ width: `${max ? (count / max) * 100 : 0}%` }}
        />
      </span>
    </Link>
  );
}
