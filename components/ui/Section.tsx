import type { ReactNode } from "react";

export function Section({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-1 flex items-baseline gap-3">
        <h2 className="text-sm font-sans-semibold text-ink">{title}</h2>
        {action ? <div className="ml-auto text-sm text-ink-muted">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
