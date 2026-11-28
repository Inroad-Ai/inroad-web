import type { ReactNode } from "react";

export function RowList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <ul className={`divide-y divide-line ${className}`}>{children}</ul>;
}

export function RowListItem({
  leading,
  title,
  detail,
  trailing,
}: {
  leading?: ReactNode;
  title: ReactNode;
  detail?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <li className="flex items-center gap-3.5 py-3">
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-sans-semibold text-ink">{title}</p>
        {detail ? <p className="mt-0.5 truncate text-xs text-ink-muted">{detail}</p> : null}
      </div>
      {trailing ? <div className="flex shrink-0 items-center gap-3">{trailing}</div> : null}
    </li>
  );
}
