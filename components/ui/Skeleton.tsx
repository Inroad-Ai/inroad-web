export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`animate-shimmer rounded-full bg-ink/10 ${className}`} />
  );
}
