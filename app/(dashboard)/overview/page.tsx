import { OverviewDashboard } from "@/components/composed/dashboard/OverviewDashboard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function OverviewPage() {
  return (
    <PageShell
      title="Overview"
      description="See what needs attention, then check how your search is moving."
    >
      <OverviewDashboard />
    </PageShell>
  );
}
