import type { ReactNode } from "react";

/** Pass layout via className: `px-6 py-6` inline, `py-16 text-center` for a page. */
export function EmptyState({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`text-sm text-text-secondary ${className}`}>{children}</p>;
}
