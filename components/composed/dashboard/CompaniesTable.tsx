"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchCompanies } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { readStorage, writeStorage } from "@/lib/browser-storage";
import { SESSION_EXPIRED } from "@/lib/companies";
import { plural } from "@/lib/format";
import type { Company, CompanySort } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import type { PipelineStage } from "@/components/ui/StatusBadge";

import { CompaniesEmpty } from "./companies/CompaniesEmpty";
import { MatchProgressNotice } from "./companies/MatchProgressNotice";
import { CompaniesToolbar, type CompaniesView } from "./companies/CompaniesToolbar";
import { CompanyCardGrid } from "./companies/CompanyCardGrid";
import { CompanyRowsTable } from "./companies/CompanyRowsTable";

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 300;
const VIEW_STORAGE_KEY = "inroad:companies-view";

type LoadState = "loading" | "error" | "ready";

/** The Companies screen: toolbar, table or card view, and paging. */
export function CompaniesTable() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<PipelineStage | "all">("all");
  const [sort, setSort] = useState<CompanySort>("updated_desc");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<CompaniesView>("table");

  const [state, setState] = useState<LoadState>("loading");
  const [data, setData] = useState<{ items: Company[]; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  // Bumped as matched companies' research lands; that reload keeps the rows
  // on screen instead of flashing the loading state.
  const [refreshKey, setRefreshKey] = useState(0);
  const quietReload = useRef(false);
  const refreshQuietly = useCallback(() => {
    quietReload.current = true;
    setRefreshKey((key) => key + 1);
  }, []);

  // Read after mount so the server and first client render agree.
  useEffect(() => {
    if (readStorage(VIEW_STORAGE_KEY) === "cards") setView("cards");
  }, []);

  // Debounce the search box; typing resets to page 1 once the debounced
  // value actually changes, not on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search, stage, sort]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      if (!quietReload.current) setState("loading");
      quietReload.current = false;
      const token = await ensureValidAccessToken();
      if (!token) {
        setErrorMessage(SESSION_EXPIRED);
        setState("error");
        return;
      }

      try {
        const response = await fetchCompanies(
          {
            search: search || undefined,
            stage: stage === "all" ? undefined : stage,
            sort,
            page,
            pageSize: PAGE_SIZE,
          },
          token,
          controller.signal,
        );
        setData({ items: response.items, total: response.total });
        setState("ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        setErrorMessage(err instanceof Error ? err.message : "Could not load companies.");
        setState("error");
      }
    }

    load();
    return () => controller.abort();
  }, [search, stage, sort, page, refreshKey]);

  function changeView(next: CompaniesView) {
    setView(next);
    writeStorage(VIEW_STORAGE_KEY, next);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStage("all");
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const hasFilters = search !== "" || stage !== "all";
  const items = data?.items ?? [];
  const openCompany = (id: string) => router.push(`/companies/${id}`);
  const loading = state === "loading";

  return (
    <div className="flex flex-col gap-5">
      <MatchProgressNotice onResearched={refreshQuietly} />
      <CompaniesToolbar
        searchInput={searchInput}
        onSearchInput={setSearchInput}
        stage={stage}
        onStage={setStage}
        sort={sort}
        onSort={setSort}
        view={view}
        onView={changeView}
      />

      <div aria-busy={loading}>
        {state === "error" ? (
          <CompaniesEmpty kind="error" errorMessage={errorMessage} onClearFilters={clearFilters} />
        ) : !loading && items.length === 0 ? (
          <CompaniesEmpty kind={hasFilters ? "filtered" : "none"} onClearFilters={clearFilters} />
        ) : view === "table" ? (
          <CompanyRowsTable companies={items} loading={loading} onOpen={openCompany} />
        ) : (
          <CompanyCardGrid companies={items} loading={loading} onOpen={openCompany} />
        )}
      </div>

      {state === "ready" && data && data.items.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="utility-label text-ink-muted">
            {plural(data.total, "company", "companies")}, page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="quiet"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="quiet"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
