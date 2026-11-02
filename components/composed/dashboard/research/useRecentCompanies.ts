"use client";

import { useEffect, useState } from "react";

import { fetchCompanies } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { Company } from "@/lib/types";

const RECENT_LIMIT = 6;

/** The user's most recently researched companies, from the server, so the
 * list survives leaving the page. Reloads whenever `version` changes (a
 * research finished). */
export function useRecentCompanies(version: number) {
  const [companies, setCompanies] = useState<Company[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const token = await ensureValidAccessToken();
        if (!token) return;
        const page = await fetchCompanies(
          { sort: "updated_desc", page: 1, pageSize: RECENT_LIMIT },
          token,
          controller.signal,
        );
        setCompanies(page.items);
      } catch {
        // A list that can't load stays empty; the research form still works.
        if (!controller.signal.aborted) setCompanies([]);
      }
    })();
    return () => controller.abort();
  }, [version]);

  return companies;
}
