const TONES = {
  amber: "bg-signal-amber",
  teal: "bg-signal-teal",
  success: "bg-success",
  warning: "bg-warning",
  faint: "bg-ink-faint",
} as const;

export type ProgressTone = keyof typeof TONES;

/** A thin filled track. `value` is 0 to 1; the fill scales rather than resizes
 * so the change animates on the compositor. `pulse` marks a step in progress. */
export function ProgressBar({
  value,
  tone = "amber",
  thick = false,
  pulse = false,
  label,
  className = "",
}: {
  value: number;
  tone?: ProgressTone;
  thick?: boolean;
  pulse?: boolean;
  /** Given, the bar is announced as a progressbar; omitted, it is decorative. */
  label?: string;
  className?: string;
}) {
  const clamped = Math.min(1, Math.max(0, value));
  const a11y = label
    ? {
        role: "progressbar",
        "aria-label": label,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": Math.round(clamped * 100),
      }
    : { "aria-hidden": true };

  return (
    <span
      {...a11y}
      className={`block overflow-hidden rounded-full bg-ink/10 ${thick ? "h-2" : "h-1"} ${className}`}
    >
      <span
        className={`block h-full origin-left rounded-full transition-transform duration-slow ease-emphasized ${TONES[tone]} ${
          pulse ? "animate-shimmer" : ""
        }`}
        style={{ transform: `scaleX(${clamped})` }}
      />
    </span>
  );
}
