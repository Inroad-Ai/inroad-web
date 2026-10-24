import { PageShell } from "@/components/composed/dashboard/PageShell";
import { SettingsPanel } from "@/components/composed/dashboard/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <PageShell title="Settings" description="Your account. Profile details live on Profile.">
      <SettingsPanel />
    </PageShell>
  );
}
