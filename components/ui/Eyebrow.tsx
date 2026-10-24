import type { ReactNode } from "react";

/** Mono uppercase label above a heading or naming a group. `dot` adds the
 * amber marker; `live` makes it breathe, for something still running. */
export function Eyebrow({
  as: Tag = "p",
  dot,
  className = "",
  children,
}: {
  as?: "p" | "span" | "h2" | "h3";
  dot?: "static" | "live";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`utility-label inline-flex items-center gap-2.5 text-ink-muted ${className}`}>
      {dot ? (
        <span
          aria-hidden
          className={`h-1.5 w-1.5 shrink-0 rounded-full bg-signal-amber ${
            dot === "live" ? "animate-ring-pulse" : ""
          }`}
        />
      ) : null}
      {children}
    </Tag>
  );
}
