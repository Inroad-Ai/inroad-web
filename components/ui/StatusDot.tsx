import type { CardState } from "@/lib/types";

/**
 * The state names are internal. Nothing here renders text — the label next to
 * the dot is the caller's job, in the caller's words.
 */
const STATES: Record<CardState, string> = {
  idle: "bg-ink/20",
  pending: "bg-signal-teal animate-pulse-dot",
  done: "bg-signal-amber",
  failed: "bg-muted-rose",
};

export function StatusDot({ state }: { state: CardState }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${STATES[state]}`}
    />
  );
}
