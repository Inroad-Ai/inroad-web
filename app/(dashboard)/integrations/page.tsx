import { IntegrationsBoard } from "@/components/composed/dashboard/IntegrationsBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function IntegrationsPage() {
  return (
    <PageShell
      title="Integrations"
      description="Connect your own API keys to enrich people found during research."
    >
      <IntegrationsBoard />
    </PageShell>
  );
}
