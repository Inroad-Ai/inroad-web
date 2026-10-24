import type { ReactNode } from "react";

const TONES = {
  error: { text: "text-error", box: "bg-error-subtle" },
  success: { text: "text-success", box: "bg-success-subtle" },
  neutral: { text: "text-ink-muted", box: "bg-surface-raised" },
} as const;

/** A short message about something that just happened: an error is announced
 * as an alert, anything else politely. `boxed` gives it its tone's tint. */
export function Notice({
  tone = "error",
  boxed = false,
  size = "sm",
  className = "",
  children,
}: {
  tone?: keyof typeof TONES;
  boxed?: boolean;
  size?: "xs" | "sm";
  className?: string;
  children: ReactNode;
}) {
  const { text, box } = TONES[tone];
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`${size === "xs" ? "text-xs" : "text-sm"} ${text} ${
        boxed ? `rounded-nest px-3.5 py-2.5 ${box}` : ""
      } ${className}`}
    >
      {children}
    </p>
  );
}
