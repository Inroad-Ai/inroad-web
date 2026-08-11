/**
 * The placeholder-bar loading treatment already used in ResultCard's
 * "still checking" state, pulled out so any new page's loading rows use the
 * same bar instead of a spinner or a differently-styled skeleton.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`rounded-full bg-surface-raised ${className}`} />;
}
