"use client";

import { useEffect, useState } from "react";

import { fetchCompanies } from "@/lib/api-client/client";
import { ensureValidAccessToken, SESSION_EXPIRED } from "@/lib/auth-native/browser";
import type { Company } from "@/lib/types";

const SEARCH_DEBOUNCE_MS = 200;
const RESULT_LIMIT = 6;

interface CompanySearchState {
  companies: Company[];
  loading: boolean;
  error: string | null;
}

/** The user's own companies matching the query, newest activity first. An
 * empty query returns the most recently updated ones. */
export function usePaletteCompanySearch(query: string): CompanySearchState {
  const [state, setState] = useState<CompanySearchState>({
    companies: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, loading: true, error: null }));

    const timer = window.setTimeout(async () => {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          setState({ companies: [], loading: false, error: SESSION_EXPIRED });
          return;
        }
        const result = await fetchCompanies(
          { search: query.trim(), sort: "updated_desc", pageSize: RESULT_LIMIT },
          token,
          controller.signal,
        );
        setState({ companies: result.items, loading: false, error: null });
      } catch {
        if (controller.signal.aborted) return;
        setState({ companies: [], loading: false, error: "Could not search your companies." });
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  return state;
}
