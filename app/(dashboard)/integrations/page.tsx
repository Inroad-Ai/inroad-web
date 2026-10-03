import { IntegrationsBoard } from "@/components/composed/dashboard/integrations/IntegrationsBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function IntegrationsPage() {
  return (
    <PageShell
      title="Integrations"
      description="Connect your inbox and contact tools for outreach and research."
    >
      <IntegrationsBoard />
    </PageShell>
  );
}
