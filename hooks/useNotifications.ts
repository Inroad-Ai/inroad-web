"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchNotifications,
  markNotificationsSeen,
  recordNotificationAction,
  type Notification,
  type NotificationAction,
  type NotificationPage,
} from "@/lib/api-client/client";
import { requireAccessToken } from "@/lib/auth-native/browser";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { announceNotificationsChanged } from "@/hooks/useUnreadNotifications";

interface UseNotificationsResult {
  items: Notification[];
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  act: (notification: Notification, action: NotificationAction) => Promise<void>;
}

/** Opening the page marks everything seen for the bell, but each item keeps
 * the unread flag it arrived with, so this visit still shows what was new. */
export function useNotifications(): UseNotificationsResult {
  const {
    data: page,
    setData: setPage,
    loading,
    error: loadError,
  } = useAsyncResource<NotificationPage | null>(
    null,
    (token, signal) => fetchNotifications(null, token, signal),
    [],
    "Could not load your notifications.",
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const hasUnread = (page?.unread_count ?? 0) > 0;

  useEffect(() => {
    if (!hasUnread) return;
    void (async () => {
      try {
        await markNotificationsSeen(await requireAccessToken());
        announceNotificationsChanged();
      } catch {
        // Stays unread; the next visit marks it again.
      }
    })();
  }, [hasUnread]);

  const loadMore = useCallback(async () => {
    if (!page?.next_cursor) return;
    setLoadingMore(true);
    setActionError(null);
    try {
      const next = await fetchNotifications(page.next_cursor, await requireAccessToken());
      setPage({ ...next, items: [...page.items, ...next.items] });
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "Could not load more.");
    } finally {
      setLoadingMore(false);
    }
  }, [page, setPage]);

  const act = useCallback(
    async (notification: Notification, action: NotificationAction) => {
      setActionError(null);
      const now = new Date().toISOString();
      setPage((current) => {
        if (!current) return current;
        const items =
          action === "dismissed"
            ? current.items.filter((item) => item.id !== notification.id)
            : current.items.map((item) =>
                item.id !== notification.id
                  ? item
                  : {
                      ...item,
                      opened_at: action === "opened" ? (item.opened_at ?? now) : item.opened_at,
                      researched_at:
                        action === "researched" ? (item.researched_at ?? now) : item.researched_at,
                    },
              );
        return { ...current, items };
      });
      try {
        await recordNotificationAction(notification.id, action, await requireAccessToken());
        announceNotificationsChanged();
      } catch (caught) {
        setActionError(caught instanceof Error ? caught.message : "Could not save that.");
      }
    },
    [setPage],
  );

  return {
    items: page?.items ?? [],
    hasMore: Boolean(page?.next_cursor),
    loading,
    loadingMore,
    error: actionError ?? loadError,
    act,
    loadMore,
  };
}
