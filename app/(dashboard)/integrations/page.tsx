import { IntegrationsBoard } from "@/components/composed/dashboard/integrations/IntegrationsBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function IntegrationsPage() {
  return (
    <PageShell
      title="Integrations"
      description="Connect your Gmail to send, a contact-data provider to find verified emails, and, if you want, your own AI key for outreach drafts. Everything here is private to your account."
    >
      <IntegrationsBoard />
    </PageShell>
  );
}
