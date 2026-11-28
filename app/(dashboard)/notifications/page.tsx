import { PageShell } from "@/components/composed/dashboard/PageShell";
import { NotificationsPanel } from "@/components/composed/dashboard/notifications/NotificationsPanel";

export default function NotificationsPage() {
  return (
    <PageShell
      title="Notifications"
      description="What needs you comes first. Hiring posts that fit your target roles, and news from companies you saved."
      maxWidth={820}
    >
      <NotificationsPanel />
    </PageShell>
  );
}
