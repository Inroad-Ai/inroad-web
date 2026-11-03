"use client";

import posthog from "posthog-js";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let initializedForUserId: string | null = null;

function initializeForAuthenticatedUser(userId: string) {
  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!token || initializedForUserId === userId) return;

  // This component is mounted only below the authenticated dashboard layout.
  // Bootstrap avoids creating or transmitting an anonymous browser identity.
  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    bootstrap: { distinctID: userId, isIdentifiedID: true },
    capture_pageview: false,
    capture_pageleave: false,
    autocapture: false,
    capture_exceptions: false,
    disable_session_recording: true,
    disable_surveys: true,
    persistence: "memory",
    save_referrer: false,
    save_campaign_params: false,
    property_denylist: [
      "$current_url",
      "$pathname",
      "$referrer",
      "$referring_domain",
      "$raw_user_agent",
    ],
    before_send(event) {
      // The only permitted browser identity is the already authenticated
      // product user id. All route, browser, and arbitrary event metadata is
      // removed before send.
      const properties = event.properties ?? {};
      event.properties = {
        $token: properties.$token,
        $distinct_id: userId,
      };
      return event;
    },
  });
  initializedForUserId = userId;
}

/** Manual, authenticated-only analytics: no anonymous browser telemetry. */
export function ProductAnalytics({ userId }: { userId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    initializeForAuthenticatedUser(userId);
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.capture("page_view", {});
  }, [pathname, userId]);

  return null;
}

export function ProductAnalyticsIdentity({ userId }: { userId: string }) {
  useEffect(() => {
    initializeForAuthenticatedUser(userId);
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.capture("dashboard_opened", {});
  }, [userId]);

  return null;
}
