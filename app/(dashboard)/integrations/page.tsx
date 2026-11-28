import { IntegrationsBoard } from "@/components/composed/dashboard/integrations/IntegrationsBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";
import { SourceExtras } from "@/components/composed/dashboard/v2/pages/SourceExtras";

export default function IntegrationsPage() {
  return (
    <PageShell
      title="Sources"
      description="The accounts Inroad can use for you, and which contact source to try first. Your keys are private to you."
      maxWidth={960}
    >
      <IntegrationsBoard />
      <SourceExtras />
    </PageShell>
  );
}
