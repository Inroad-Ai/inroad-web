import { Badge } from "@/components/ui/Badge";
import type { ScanRow } from "@/lib/landing/ask-types";

import type { RowState } from "./console.types";

const SYNCING_SHARE = 0.7;

const STATUS: Record<RowState, { label: string; tone: "neutral" | "amber" | "teal" }> = {
  pending: { label: "Pending", tone: "neutral" },
  sync: { label: "Syncing", tone: "amber" },
  live: { label: "Live", tone: "teal" },
};

const countFor = (row: ScanRow, state: RowState) => {
  const value = state === "live" ? row.count : state === "sync" ? row.count * SYNCING_SHARE : 0;
  return `${Math.round(value).toLocaleString("en-US")} ${row.unit}`;
};

/** The sources an answer is reading, each moving from Pending to Live. */
export function SourceTable({
  rows,
  states,
}: {
  rows: readonly ScanRow[];
  states: readonly RowState[];
}) {
  return (
    <div className="mb-1 mt-2.5 overflow-hidden rounded-nest bg-surface-raised">
      {rows.map((row, i) => {
        const state = states[i] ?? "pending";
        const { label, tone } = STATUS[state];
        return (
          <div
            key={row.name}
            className="grid grid-cols-sources items-center gap-2.5 border-t border-line px-3.5 py-2.5 text-sm first:border-t-0 sm:grid-cols-sources-wide"
          >
            <span className="font-mono text-2xs text-ink-faint">0{i + 1}</span>
            <span className="truncate font-sans-medium text-ink">{row.name}</span>
            <span className="hidden text-right font-mono text-2xs text-ink-muted sm:block">
              {countFor(row, state)}
            </span>
            <span className="justify-self-end">
              <Badge tone={tone} dot={state !== "pending"}>
                {label}
              </Badge>
            </span>
          </div>
        );
      })}
    </div>
  );
}
