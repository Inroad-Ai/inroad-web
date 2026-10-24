import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const KPI_COUNT = 3;

function PanelSkeleton() {
  return (
    <Card>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-5 w-40" />
      <Skeleton className="mt-2 h-3 w-56 max-w-full" />
      <Skeleton className="mt-6 h-chart w-full rounded-nest" />
    </Card>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading your overview">
      <Card padding="lg">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-4 h-8 w-80 max-w-full" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: KPI_COUNT }, (_, index) => (
          <Card key={index}>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-9 w-16" />
            <Skeleton className="mt-3 h-3 w-32" />
          </Card>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <PanelSkeleton />
        </div>
        <div className="xl:col-span-2">
          <PanelSkeleton />
        </div>
      </div>
    </div>
  );
}
