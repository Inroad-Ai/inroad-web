import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** The app's titled card: heading on the left, `meta` (a count, a link)
 * opposite it. Given an `id`, it is a jump target that clears the sticky header. */
export function DashboardPanel({
  id,
  title,
  eyebrow,
  description,
  meta,
  className = "",
  children,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  description?: string;
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const titleId = id ? `${id}-title` : undefined;

  return (
    <Card
      as="section"
      id={id}
      aria-labelledby={titleId}
      className={`min-w-0 ${id ? "scroll-mt-24" : ""} ${className}`}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? <Eyebrow className="mb-2">{eyebrow}</Eyebrow> : null}
          <h2 id={titleId} className="text-xl font-sans-semibold tracking-heading text-ink">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">{description}</p>
          ) : null}
        </div>
        {meta ? <div className="flex shrink-0 items-center gap-2">{meta}</div> : null}
      </header>
      {children}
    </Card>
  );
}
