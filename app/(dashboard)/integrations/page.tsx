import { IntegrationsBoard } from "@/components/composed/dashboard/integrations/IntegrationsBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function IntegrationsPage() {
  return (
    <PageShell
      title="Sources"
      description="What Inroad can use on your behalf: your Gmail to send, a contact-data provider to find verified emails, and, if you want, your own AI key. Everything here is private to your account."
      maxWidth={960}
    >
      <IntegrationsBoard />
    </PageShell>
  );
}
