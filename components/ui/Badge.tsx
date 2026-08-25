import type { ReactNode } from "react";

type Tone = "amber" | "teal" | "rose" | "neutral" | "success";

const TONES: Record<Tone, string> = {
  amber: "border-signal-amber/40 bg-signal-amber/10 text-signal-amber",
  teal: "border-signal-teal/40 bg-signal-teal/10 text-signal-teal",
  rose: "border-muted-rose/40 bg-muted-rose/10 text-muted-rose",
  neutral: "border-line bg-surface-raised text-text-secondary",
  success: "border-success/40 bg-success-subtle text-success",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`utility-label inline-flex items-center gap-2 rounded-full border px-2.5 py-1 ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
