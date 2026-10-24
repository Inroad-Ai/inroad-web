import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";

/** Mono eyebrow, display heading and subline: the top of every auth screen. */
export function AuthHeading({
  eyebrow,
  isLive = false,
  title,
  children,
}: {
  eyebrow?: string;
  /** Breathing dot on the eyebrow, for a screen that is still working. */
  isLive?: boolean;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div>
      {eyebrow ? <Eyebrow dot={isLive ? "live" : undefined}>{eyebrow}</Eyebrow> : null}
      <h1 className="mt-3 text-balance font-display text-title font-sans-semibold tracking-display text-ink">
        {title}
      </h1>
      {children ? <p className="mt-4 text-base text-ink-muted">{children}</p> : null}
    </div>
  );
}
