"use client";

import { BellIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/IconButton";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

export const NOTIFICATIONS_HREF = "/notifications";

export function NotificationBell() {
  const unread = useUnreadNotifications();

  return (
    <IconButton
      href={NOTIFICATIONS_HREF}
      label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
    >
      <BellIcon />
      {unread > 0 ? (
        <span
          aria-hidden
          className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-signal-amber px-1 text-eyebrow font-sans-bold text-on-amber"
        >
          {unread > 9 ? "9+" : unread}
        </span>
      ) : null}
    </IconButton>
  );
}
