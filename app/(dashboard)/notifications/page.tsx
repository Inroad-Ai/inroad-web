import { PageShell } from "@/components/composed/dashboard/PageShell";
import { NotificationsPanel } from "@/components/composed/dashboard/notifications/NotificationsPanel";

export default function NotificationsPage() {
  return (
    <PageShell
      title="Notifications"
      description="Hiring posts that fit your target roles, and news from companies you saved."
    >
      <NotificationsPanel />
    </PageShell>
  );
}
