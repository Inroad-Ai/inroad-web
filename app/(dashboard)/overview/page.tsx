import { PageShell } from "@/components/composed/dashboard/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";

export default function OverviewPage() {
  return (
    <PageShell
      title="Overview"
      description="Where your search stands, at a glance."
    >
      <div className="rounded-md border border-line bg-surface">
        <EmptyState className="px-6 py-16 text-center">
          Nothing to show yet. This fills in once you have companies in your pipeline.
        </EmptyState>
      </div>
    </PageShell>
  );
}
