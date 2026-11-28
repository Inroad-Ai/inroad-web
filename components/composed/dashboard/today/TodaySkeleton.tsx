import { Skeleton } from "@/components/ui/Skeleton";

export function TodaySkeleton() {
  return (
    <div role="status" aria-label="Loading today" className="max-w-3xl">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-3 h-9 w-80" />
      <div className="mt-10 grid gap-4">
        {[0, 1, 2].map((row) => (
          <Skeleton key={row} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
