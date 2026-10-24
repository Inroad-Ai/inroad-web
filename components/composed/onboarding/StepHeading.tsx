import type { ReactNode } from "react";

/** The display heading and subline that open every onboarding step. */
export function StepHeading({
  title,
  aside,
  children,
}: {
  title: string;
  /** Sits beside the heading, e.g. an "optional" marker. */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-balance font-display text-title font-sans-semibold tracking-display text-ink">
          {title}
        </h1>
        {aside}
      </div>
      {children ? <div className="mt-3 text-base text-ink-muted">{children}</div> : null}
    </div>
  );
}
