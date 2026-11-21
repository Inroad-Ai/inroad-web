import type { ReactNode } from "react";

/** A titled section of a page: heading on the left, `meta` (a count, a link)
 * opposite it, then the content. There is no box around it; spacing groups.
 * Given an `id`, it is a jump target that clears the sticky header. */
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
    <section
      id={id}
      aria-labelledby={titleId}
      className={`min-w-0 border-b border-line pb-8 last:border-b-0 last:pb-0 ${id ? "scroll-mt-24" : ""} ${className}`}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? <p className="mb-1 text-xs text-ink-faint">{eyebrow}</p> : null}
          <h2 id={titleId} className="text-base font-sans-semibold tracking-heading text-ink">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">{description}</p>
          ) : null}
        </div>
        {meta ? <div className="flex shrink-0 items-center gap-2">{meta}</div> : null}
      </header>
      {children}
    </section>
  );
}
