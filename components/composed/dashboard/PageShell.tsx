import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  /** For a page whose content names itself (a company's own header): the
   * title stays for screen readers and the tab, but isn't shown. */
  hideTitle?: boolean;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

/** Same width, gutters and header for every dashboard page. The header owns
 * the gap below it, so a page's first block never sets its own top margin. */
export function PageShell({
  title,
  hideTitle = false,
  description,
  action,
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-page px-page pb-16 pt-6 sm:pt-8">
      <header
        className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-3 ${hideTitle ? "mb-4" : "mb-6"}`}
      >
        <div className={hideTitle ? "sr-only" : "min-w-0 max-w-3xl"}>
          <h1 className="text-balance break-words font-display text-page-title font-sans-semibold tracking-heading text-ink">
            {title}
          </h1>
          {description ? <p className="mt-2 text-sm text-ink-muted">{description}</p> : null}
        </div>
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </header>

      {children}
    </div>
  );
}
