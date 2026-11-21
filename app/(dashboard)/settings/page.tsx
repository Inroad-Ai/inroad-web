import { PageShell } from "@/components/composed/dashboard/PageShell";
import { SettingsPanel } from "@/components/composed/dashboard/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Calm by default. Your account and how Inroad follows up. Profile details live on Profile."
      maxWidth={820}
    >
      <SettingsPanel />
    </PageShell>
  );
}
