import { OverviewDashboard } from "@/components/composed/dashboard/OverviewDashboard";
import { PageShell } from "@/components/composed/dashboard/PageShell";
import { TodayDashboard } from "@/components/composed/dashboard/today/TodayDashboard";
import { UI_V2 } from "@/lib/feature-flags";

export default function OverviewPage() {
  if (UI_V2) {
    return (
      <PageShell title="Today" hideTitle>
        <TodayDashboard />
      </PageShell>
    );
  }

  return (
    <PageShell title="Overview" description="Where your search stands, at a glance.">
      <OverviewDashboard />
    </PageShell>
  );
}
