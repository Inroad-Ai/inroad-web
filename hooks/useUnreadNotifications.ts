"use client";

import { useEffect, useState } from "react";

import { fetchUnreadNotificationCount } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";

const POLL_MS = 60_000;
const NOTIFICATIONS_CHANGED = "inroad:notifications-changed";

/** Tells the header's count to refresh now rather than at its next poll. */
export function announceNotificationsChanged(): void {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
}

/** The unread count for the header bell: polled while the tab is visible,
 * and refreshed on focus or when the notifications page changes something. */
export function useUnreadNotifications(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let controller: AbortController | null = null;

    async function refresh() {
      controller?.abort();
      const current = new AbortController();
      controller = current;
      try {
        const token = await ensureValidAccessToken();
        if (!token) return;
        setCount(await fetchUnreadNotificationCount(token, current.signal));
      } catch {
        // The bell keeps its last count; the next poll tries again.
      }
    }

    const onChange = () => void refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") onChange();
    }, POLL_MS);
    window.addEventListener(NOTIFICATIONS_CHANGED, onChange);
    window.addEventListener("focus", onChange);
    onChange();

    return () => {
      window.clearInterval(timer);
      window.removeEventListener(NOTIFICATIONS_CHANGED, onChange);
      window.removeEventListener("focus", onChange);
      controller?.abort();
    };
  }, []);

  return count;
}
