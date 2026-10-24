import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function SectionSkeleton() {
  return (
    <Card>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
    </Card>
  );
}

export function CompanyReportSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy>
      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center gap-5 bg-ink/5 px-6 py-9 sm:px-8">
          <Skeleton className="h-16 w-16" />
          <div className="flex-1">
            <Skeleton className="h-8 w-56 max-w-full" />
            <Skeleton className="mt-3 h-4 w-72 max-w-full" />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-5 sm:px-8">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-28" />
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
        <div className="flex flex-col gap-6">
          <SectionSkeleton />
        </div>
      </div>
    </div>
  );
}
