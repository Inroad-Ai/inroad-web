import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description?: string;
  /** Top-right slot. One primary action per page, amber stays reserved for it. */
  action?: ReactNode;
  children: ReactNode;
}

/**
 * Every dashboard page renders through this: same max width and horizontal
 * padding, same heading/description/action layout. Extracted from the
 * Research page so new pages don't reinvent the header by hand.
 */
export function PageShell({ title, description, action, children }: PageShellProps) {
  return (
    <main className="mx-auto max-w-7xl px-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl text-ink">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
        {action ? <div className="w-full sm:w-auto">{action}</div> : null}
      </div>

      {children}
    </main>
  );
}
