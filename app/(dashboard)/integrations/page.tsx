import { IntegrationsBoard } from "@/components/composed/dashboard/integrations/IntegrationsBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function IntegrationsPage() {
  return (
    <PageShell
      title="Integrations"
      description="Connect your Gmail to send, and a contact-data provider to find verified emails. Everything here is private to your account."
    >
      <IntegrationsBoard />
    </PageShell>
  );
}
