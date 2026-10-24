import type { ReactNode } from "react";

export type BadgeTone = "amber" | "teal" | "rose" | "neutral" | "success" | "warning";

const TONES: Record<BadgeTone, { pill: string; dot: string }> = {
  amber: { pill: "bg-signal-amber-subtle text-ink", dot: "bg-signal-amber" },
  teal: { pill: "bg-signal-teal-subtle text-signal-teal", dot: "bg-current" },
  rose: { pill: "bg-muted-rose-subtle text-muted-rose", dot: "bg-current" },
  neutral: { pill: "bg-ink/5 text-ink-muted", dot: "bg-current" },
  success: { pill: "bg-success-subtle text-success", dot: "bg-current" },
  warning: { pill: "bg-warning-subtle text-warning", dot: "bg-current" },
};

export function Badge({
  tone = "neutral",
  dot = false,
  children,
}: {
  tone?: BadgeTone;
  /** A leading dot in the tone's colour, for status rather than category. */
  dot?: boolean;
  children: ReactNode;
}) {
  const { pill, dot: dotColor } = TONES[tone];

  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 font-sans text-eyebrow font-sans-bold ${pill}`}
    >
      {dot ? (
        <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
      ) : null}
      {children}
    </span>
  );
}
