"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Notice } from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/Skeleton";
import { TextLink } from "@/components/ui/TextLink";
import { useNotifications } from "@/hooks/useNotifications";
import { useSettings } from "@/hooks/useSettings";
import { useResearchRuns } from "@/lib/research-runs";

import { DashboardPanel } from "../DashboardPanel";
import { NotificationItem } from "./NotificationItem";

const SKELETON_ROWS = 3;

export function NotificationsPanel() {
  const { items, hasMore, loading, loadingMore, error, loadMore, act } = useNotifications();
  const { settings } = useSettings();
  const { startResearch } = useResearchRuns();
  const alertsOff = settings !== null && !settings.opportunity_alerts_enabled;

  return (
    <div className="max-w-3xl space-y-6">
      {alertsOff ? (
        <Notice size="xs">
          Opportunity alerts are off, so nothing new will arrive. Turn them on in{" "}
          <TextLink href="/settings">Settings</TextLink>.
        </Notice>
      ) : null}

      <DashboardPanel
        title="Opportunities"
        description="Public posts matched to your profile, newest first, each with why it was picked. At most 3 a day."
      >
        {loading ? (
          <div className="space-y-4" role="status" aria-label="Loading notifications">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-nest" />
            ))}
          </div>
        ) : items.length === 0 ? (
          error ? null : (
            <EmptyState className="py-8 text-center">
              {alertsOff
                ? "Turn on opportunity alerts and matches will show up here."
                : "Nothing yet. New matches show up here, usually within half an hour of a post."}
            </EmptyState>
          )
        ) : (
          <ul>
            {items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onResearch={() => {
                  startResearch(notification.domain);
                  void act(notification, "researched");
                }}
                onOpen={() => void act(notification, "opened")}
                onDismiss={() => void act(notification, "dismissed")}
              />
            ))}
          </ul>
        )}

        {hasMore ? (
          <div className="mt-5 border-t border-line pt-5">
            <Button variant="quiet" size="sm" loading={loadingMore} onClick={() => void loadMore()}>
              Show older
            </Button>
          </div>
        ) : null}

        {error ? (
          <Notice size="xs" className="mt-4">
            {error}
          </Notice>
        ) : null}
      </DashboardPanel>
    </div>
  );
}
