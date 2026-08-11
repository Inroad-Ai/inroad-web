import { OverviewDashboard } from "@/components/composed/dashboard/OverviewDashboard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function OverviewPage() {
  return (
    <PageShell
      title="Overview"
      description="Where your search stands, at a glance."
    >
      <OverviewDashboard />
    </PageShell>
  );
}
