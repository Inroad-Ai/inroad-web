import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";

import { DashboardPanel } from "../DashboardPanel";

export function RunListPanel({
  title,
  subtitle,
  count,
  empty,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  empty: string;
  children: ReactNode;
}) {
  return (
    <DashboardPanel title={title} description={subtitle} meta={<Badge>{count}</Badge>}>
      {count === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-nest bg-surface-raised px-6 py-10 text-center">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-signal-teal shadow-nest"
          >
            <span className="h-2 w-2 rounded-full bg-current" />
          </span>
          <p className="text-sm text-ink-muted">{empty}</p>
        </div>
      ) : (
        <ul className="-mx-2 divide-y divide-line">{children}</ul>
      )}
    </DashboardPanel>
  );
}
