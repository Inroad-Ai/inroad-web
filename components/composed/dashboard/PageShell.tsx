import type { ReactNode } from "react";

interface PageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

/** Same width, padding and header layout for every dashboard page. */
export function PageShell({ eyebrow, title, description, action, children }: PageShellProps) {
  return (
    <main className="mx-auto max-w-7xl px-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          {eyebrow ? <p className="utility-label mb-2 text-signal-teal">{eyebrow}</p> : null}
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
