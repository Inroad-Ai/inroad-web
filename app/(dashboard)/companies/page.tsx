import { PageShell } from "@/components/composed/dashboard/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CompaniesPage() {
  return (
    <PageShell
      title="Companies"
      description="Every company you've looked into, in one table."
    >
      <div className="rounded-md border border-line bg-surface">
        <EmptyState className="px-6 py-16 text-center">
          Nothing yet. Companies show up here once you research them.
        </EmptyState>
      </div>
    </PageShell>
  );
}
