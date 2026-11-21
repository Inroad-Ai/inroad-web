import { PageShell } from "@/components/composed/dashboard/PageShell";
import { TodayDashboard } from "@/components/composed/dashboard/today/TodayDashboard";

export default function OverviewPage() {
  return (
    <PageShell title="Today" hideTitle>
      <TodayDashboard />
    </PageShell>
  );
}
