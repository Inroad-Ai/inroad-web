"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchCompanies } from "@/lib/api-client/client";
import { describeHiring } from "@/lib/companies";
import { createClient } from "@/lib/supabase/browser";
import type { Company, CompanySort } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { PIPELINE_STAGES, StatusBadge, type PipelineStage } from "@/components/ui/StatusBadge";

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 300;

const SORT_OPTIONS: { value: CompanySort; label: string }[] = [
  { value: "updated_desc", label: "Last researched (newest)" },
  { value: "updated_asc", label: "Last researched (oldest)" },
  { value: "created_desc", label: "Date saved (newest)" },
  { value: "created_asc", label: "Date saved (oldest)" },
  { value: "domain_asc", label: "Domain (A-Z)" },
  { value: "domain_desc", label: "Domain (Z-A)" },
];

type LoadState = "loading" | "error" | "ready";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CompaniesTable() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<PipelineStage | "all">("all");
  const [sort, setSort] = useState<CompanySort>("updated_desc");
  const [page, setPage] = useState(1);

  const [state, setState] = useState<LoadState>("loading");
  const [data, setData] = useState<{ items: Company[]; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

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
      setState("loading");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setErrorMessage("Your session expired. Sign in again to see your companies.");
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
          session.access_token,
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
  }, [search, stage, sort, page, supabase]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const hasFilters = search !== "" || stage !== "all";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by domain..."
          className="max-w-xs"
          aria-label="Search companies by domain"
        />

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by stage">
          <StagePill active={stage === "all"} onClick={() => setStage("all")}>
            All
          </StagePill>
          {PIPELINE_STAGES.map((s) => (
            <StagePill key={s} active={stage === s} onClick={() => setStage(s)}>
              <StatusBadge stage={s} />
            </StagePill>
          ))}
        </div>

        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as CompanySort)}
          aria-label="Sort companies"
          className="ml-auto"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 rounded-md border border-line bg-surface">
        <CompaniesTableBody
          state={state}
          data={data}
          errorMessage={errorMessage}
          hasFilters={hasFilters}
          onRowClick={(id) => router.push(`/companies/${id}`)}
        />
      </div>

      {state === "ready" && data && data.items.length > 0 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-text-secondary">
          <span>
            {data.total} {data.total === 1 ? "company" : "companies"} - page {page} of{" "}
            {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="quiet"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="quiet"
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

function StagePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full transition-opacity ${active ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
    >
      {children}
    </button>
  );
}

const COLUMN_HEADERS = ["Domain", "Stage", "Hiring", "Last researched"];

function CompaniesTableBody({
  state,
  data,
  errorMessage,
  hasFilters,
  onRowClick,
}: {
  state: LoadState;
  data: { items: Company[]; total: number } | null;
  errorMessage: string;
  hasFilters: boolean;
  onRowClick: (id: string) => void;
}) {
  if (state === "error") {
    return (
      <EmptyState className="px-6 py-16 text-center">{errorMessage}</EmptyState>
    );
  }

  if (state === "loading") {
    return (
      <table className="w-full text-left text-sm">
        <TableHead />
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-t border-line">
              {COLUMN_HEADERS.map((header) => (
                <td key={header} className="px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState className="px-6 py-16 text-center">
        {hasFilters
          ? "No companies match this search and filter combination."
          : "Nothing yet. Companies show up here once you research them."}
      </EmptyState>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <TableHead />
      <tbody>
        {data.items.map((company) => {
          const hiring = describeHiring(company);
          return (
            <tr
              key={company.id}
              onClick={() => onRowClick(company.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onRowClick(company.id);
              }}
              tabIndex={0}
              role="button"
              className="cursor-pointer border-t border-line hover:bg-surface-raised"
            >
              <td className="px-6 py-4 text-ink">{company.domain}</td>
              <td className="px-6 py-4">
                <StatusBadge stage={company.stage} />
              </td>
              <td className={`px-6 py-4 ${hiring.muted ? "text-text-secondary" : "text-ink"}`}>
                {hiring.label}
              </td>
              <td className="px-6 py-4 text-text-secondary">{formatDate(company.updated_at)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TableHead() {
  return (
    <thead>
      <tr className="utility-label text-text-secondary">
        {COLUMN_HEADERS.map((header) => (
          <th key={header} className="px-6 py-3 font-normal">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
