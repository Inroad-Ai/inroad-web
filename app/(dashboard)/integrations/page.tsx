import { IntegrationsBoard } from "@/components/composed/dashboard/integrations/IntegrationsBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";
import { JobSources } from "@/components/composed/dashboard/v2/pages/JobSources";
import { SourceExtras } from "@/components/composed/dashboard/v2/pages/SourceExtras";

export default function IntegrationsPage() {
  return (
    <PageShell
      title="Sources"
      description="What Inroad looks at, and which source to trust first. Your accounts and keys are private to you."
      maxWidth={960}
    >
      <IntegrationsBoard />
      <SourceExtras />
      <JobSources />
    </PageShell>
  );
}
