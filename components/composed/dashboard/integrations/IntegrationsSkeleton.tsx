import { Skeleton } from "@/components/ui/Skeleton";

const SECTION_COUNT = 2;
const CARDS_PER_SECTION = 2;

export function IntegrationsSkeleton() {
  return (
    <div className="space-y-10" role="status" aria-label="Loading integrations">
      <Skeleton className="h-36 rounded-card" />
      {Array.from({ length: SECTION_COUNT }).map((_, section) => (
        <div key={section} className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-72 max-w-full" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: CARDS_PER_SECTION }).map((_, card) => (
              <Skeleton key={card} className="h-64 rounded-card" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
