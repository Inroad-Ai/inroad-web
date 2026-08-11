import { PageShell } from "@/components/composed/dashboard/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PipelinePage() {
  return (
    <PageShell
      title="Pipeline"
      description="Companies by stage, from first look to offer."
    >
      <div className="rounded-md border border-line bg-surface">
        <EmptyState className="px-6 py-16 text-center">
          Nothing in the pipeline yet. Move a company here once you start reaching out.
        </EmptyState>
      </div>
    </PageShell>
  );
}
