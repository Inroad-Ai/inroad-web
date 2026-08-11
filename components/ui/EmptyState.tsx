import type { ReactNode } from "react";

/**
 * Generalized from Research's "Nothing yet. Runs show up here as you make
 * them." — same voice, same visual weight, for any list/table with nothing
 * in it yet. Pass layout via className: inline lists tend to want
 * `px-6 py-6`, a whole empty page tends to want `py-16 text-center`.
 */
export function EmptyState({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`text-sm text-text-secondary ${className}`}>{children}</p>;
}
