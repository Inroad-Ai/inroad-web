"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { fetchCompanies } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { SESSION_EXPIRED, describeHiring } from "@/lib/companies";
import { companyDisplayName } from "@/lib/company-brief";
import { formatRelativeDays, plural } from "@/lib/format";
import type { Company, CompanySort } from "@/lib/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { PIPELINE_STAGES, STAGE_LABEL, type PipelineStage } from "@/components/ui/StatusBadge";

import { CompaniesEmpty } from "../../companies/CompaniesEmpty";
import { MatchProgressNotice } from "../../companies/MatchProgressNotice";
import { Btn, Ic, Status, Views } from "../kit";

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

const STAGE_TONE: Record<PipelineStage, "faint" | "amber" | "teal" | "ochre" | "rose"> = {
  researched: "faint",
  contacted: "teal",
  responded: "amber",
  interviewing: "teal",
  closed: "ochre",
  rejected: "rose",
};

const NEXT_STEP: Record<PipelineStage, string> = {
  researched: "Reach out",
  contacted: "Follow up",
  responded: "Reply",
  interviewing: "Prepare",
  closed: "Closed",
  rejected: "Rejected",
};

interface Result {
  items: Company[];
  total: number;
}

function Th({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="ci">
      <Ic n={icon} size="xs" />
      {children}
    </span>
  );
}

export function CompaniesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<PipelineStage | "all">("all");
  const [sort, setSort] = useState<CompanySort>("updated_desc");
  const [page, setPage] = useState(1);

  // Results by query. A tab you have already opened shows instantly while a
  // fresh copy loads behind it.
  const cache = useRef(new Map<string, Result>());
  const [lastShown, setLastShown] = useState<Result | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshQuietly = useCallback(() => setRefreshKey((key) => key + 1), []);

  const key = `${stage}|${search}|${sort}|${page}`;
  const cached = cache.current.get(key) ?? null;
  // Until this query answers, keep showing whatever was last on screen.
  const shown = cached ?? lastShown;

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim();
      if (next === search) return;
      setSearch(next);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const token = await ensureValidAccessToken();
      if (!token) {
        setErrorMessage(SESSION_EXPIRED);
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
        const result = { items: response.items, total: response.total };
        cache.current.set(key, result);
        setLastShown(result);
        setErrorMessage("");
      } catch (err) {
        if (controller.signal.aborted) return;
        setErrorMessage(err instanceof Error ? err.message : "Could not load companies.");
      }
    }

    void load();
    return () => controller.abort();
  }, [key, search, stage, sort, page, refreshKey]);

  // Warm every stage tab so switching between them is instant.
  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      const token = await ensureValidAccessToken();
      if (!token) return;
      await Promise.all(
        ["all", ...PIPELINE_STAGES].map(async (value) => {
          const warmKey = `${value}||${sort}|1`;
          try {
            const response = await fetchCompanies(
              {
                stage: value === "all" ? undefined : (value as PipelineStage),
                sort,
                page: 1,
                pageSize: PAGE_SIZE,
              },
              token,
              controller.signal,
            );
            cache.current.set(warmKey, { items: response.items, total: response.total });
          } catch {
            // A tab that fails to warm just loads when opened.
          }
        }),
      );
    })();
    return () => controller.abort();
  }, [sort, refreshKey]);

  function changeStage(next: PipelineStage | "all") {
    if (next === stage) return;
    setStage(next);
    setPage(1);
  }

  function changeSort(next: CompanySort) {
    setSort(next);
    setPage(1);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStage("all");
    setPage(1);
  }

  const items = shown?.items ?? [];
  const total = shown?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = search !== "" || stage !== "all";
  const firstLoad = shown === null && !errorMessage;
  // The rows on screen belong to another query until this one answers.
  const stale = cached === null && shown !== null;
  const failed = shown === null && Boolean(errorMessage);
  const nothingAtAll = shown !== null && total === 0 && !hasFilters;

  return (
    <div>
      <div className="row head">
        <div>
          <h1 className="t">Companies</h1>
          <div className="sub">
            {shown && !hasFilters
              ? `${plural(total, "company", "companies")} you researched or saved.`
              : "Every company you've looked into, in one place."}
          </div>
        </div>
        <span className="sp" />
        <Btn kind="p" icon="plus" href="/research">
          Research a company
        </Btn>
      </div>

      <div style={{ marginTop: 18 }}>
        <MatchProgressNotice onResearched={refreshQuietly} />
      </div>

      <div style={{ marginTop: 22 }}>
        <Views
          items={[
            { l: "All", on: stage === "all", onSelect: () => changeStage("all") },
            ...PIPELINE_STAGES.map((value) => ({
              l: STAGE_LABEL[value],
              on: stage === value,
              onSelect: () => changeStage(value),
            })),
          ]}
        />
      </div>

      <div className="row wrap" style={{ gap: 14, margin: "12px 0 4px" }}>
        <label className="field" style={{ height: 34, width: 280, maxWidth: "100%" }}>
          <Ic n="search" size="xs" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by domain"
            aria-label="Search companies by domain"
            style={{
              background: "none",
              border: 0,
              outline: 0,
              color: "inherit",
              font: "inherit",
              width: "100%",
            }}
          />
        </label>
        <span className="sp" />
        <label className="sm muted">
          Sort{" "}
          <select
            value={sort}
            onChange={(e) => changeSort(e.target.value as CompanySort)}
            aria-label="Sort companies"
            style={{
              background: "transparent",
              color: "rgb(var(--color-ink))",
              border: 0,
              font: "inherit",
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} style={{ color: "initial" }}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {failed ? (
        <CompaniesEmpty kind="error" errorMessage={errorMessage} onClearFilters={clearFilters} />
      ) : nothingAtAll ? (
        <CompaniesEmpty kind="none" onClearFilters={clearFilters} />
      ) : (
        <div
          className="tablewrap"
          aria-busy={firstLoad || stale}
          style={{
            // The frame never changes size or unmounts between tabs.
            minHeight: 320,
            opacity: stale ? 0.6 : 1,
            transition: "opacity 150ms ease",
          }}
        >
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 280 }}>
                  <Th icon="building">Company</Th>
                </th>
                <th>
                  <Th icon="kanban">Stage</Th>
                </th>
                <th>
                  <Th icon="briefcase">Hiring</Th>
                </th>
                <th>
                  <Th icon="clock">Last researched</Th>
                </th>
                <th>
                  <Th icon="arrow">Next step</Th>
                </th>
              </tr>
            </thead>
            <tbody>
              {firstLoad ? (
                <tr>
                  <td colSpan={5} className="faint">
                    Loading companies...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ height: 120 }}>
                    <span className="muted">
                      {stage === "all"
                        ? "No companies match that search."
                        : `Nothing at the ${STAGE_LABEL[stage as PipelineStage]} stage${search ? " for that search" : ""} yet.`}
                    </span>{" "}
                    {hasFilters ? (
                      <button type="button" className="amber m" onClick={clearFilters}>
                        Clear filters
                      </button>
                    ) : null}
                  </td>
                </tr>
              ) : (
                items.map((company) => {
                  const hiring = describeHiring(company);
                  return (
                    <tr key={company.id}>
                      <td>
                        <Link href={`/companies/${company.id}`} className="row">
                          <CompanyLogo logoUrl={company.logo_url} seed={company.domain} size="sm" />
                          <div>
                            <span className="m">{companyDisplayName(company)}</span>{" "}
                            <span className="faint xs">{company.domain}</span>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <Status tone={STAGE_TONE[company.stage]}>
                          {STAGE_LABEL[company.stage]}
                        </Status>
                      </td>
                      <td className={hiring.muted ? "muted" : "m"}>{hiring.label}</td>
                      <td className="muted">{formatRelativeDays(company.updated_at)}</td>
                      <td className={company.stage === "responded" ? "amber m" : "muted"}>
                        {NEXT_STEP[company.stage]}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {shown && total > 0 ? (
        <div className="row wrap" style={{ gap: 12, marginTop: 16 }}>
          <span className="sm faint">
            {plural(total, "company", "companies")}, page {page} of {totalPages}
          </span>
          <span className="sp" />
          <button
            type="button"
            className="btn sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
