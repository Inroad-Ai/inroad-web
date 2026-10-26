import { IntegrationsBoard } from "@/components/composed/dashboard/integrations/IntegrationsBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function IntegrationsPage() {
  return (
    <PageShell
      title="Integrations"
      description="Connect your Gmail to send, a contact-data provider to find verified emails, and your own AI model keys for resume parsing and outreach. Everything here is private to your account."
    >
      <IntegrationsBoard />
    </PageShell>
  );
}
