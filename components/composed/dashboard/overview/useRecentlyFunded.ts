"use client";

import { useEffect, useState } from "react";

import { fetchRecentlyFunded, type FundedCompany } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";

/** Funded companies with a role that fits the user. Empty while loading and
 * when the feed is unavailable, so callers simply render nothing. */
export function useRecentlyFunded(): FundedCompany[] {
  const [items, setItems] = useState<FundedCompany[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const token = await ensureValidAccessToken();
        if (!token) return;
        const result = await fetchRecentlyFunded(token, controller.signal);
        if (result.available) setItems(result.items ?? []);
      } catch {
        // A best-effort feed: nothing to show is a fine outcome.
      }
    })();
    return () => controller.abort();
  }, []);

  return items;
}
