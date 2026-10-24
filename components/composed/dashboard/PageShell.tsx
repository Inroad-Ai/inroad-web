import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

/** Same width, gutters and header for every dashboard page. The header owns
 * the gap below it, so a page's first block never sets its own top margin. */
export function PageShell({ title, description, action, children }: PageShellProps) {
  return (
    <div className="w-full max-w-7xl px-page pb-16 pt-8 sm:pt-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0 max-w-3xl">
          <h1 className="text-balance break-words font-display text-title font-sans-semibold tracking-display text-ink">
            {title}
          </h1>
          {description ? <p className="mt-3 text-base text-ink-muted">{description}</p> : null}
        </div>
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </header>

      {children}
    </div>
  );
}
