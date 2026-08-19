import { JobBoard } from "@/components/composed/dashboard/JobBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function JobsPage() {
  return (
    <PageShell
      title="Job Board"
      description="Open roles surfaced across everyone's research, in one place."
    >
      <JobBoard />
    </PageShell>
  );
}
