import { PageShell } from "@/components/composed/dashboard/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";

// Placeholder until the Company Profile page is built. Companies table rows
// already link here by id, so the route exists and won't 404 in the
// meantime.
export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  return (
    <PageShell title="Company profile" description={`Company ${params.id}`}>
      <div className="rounded-md border border-line bg-surface">
        <EmptyState className="px-6 py-16 text-center">
          The company profile page is not built yet.
        </EmptyState>
      </div>
    </PageShell>
  );
}
