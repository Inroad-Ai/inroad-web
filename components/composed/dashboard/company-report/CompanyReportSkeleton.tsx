import { Skeleton } from "@/components/ui/Skeleton";

export function CompanyReportSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="rounded-md border border-line bg-surface p-7">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-3 h-6 w-48" />
        <Skeleton className="mt-3 h-4 w-64" />
      </div>
      {[0, 1].map((index) => (
        <div key={index} className="rounded-md border border-line bg-surface px-6 py-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
