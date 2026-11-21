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

type LoadState = "loading" | "error" | "ready";

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

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStage("all");
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const hasFilters = search !== "" || stage !== "all";
  const items = data?.items ?? [];
  const loading = state === "loading";

  return (
    <div>
      <div className="row head">
        <div>
          <h1 className="t">Companies</h1>
          <div className="sub">
            {data && !hasFilters
              ? `${plural(data.total, "company", "companies")} you researched or saved.`
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
            { l: "All", on: stage === "all", onSelect: () => setStage("all") },
            ...PIPELINE_STAGES.map((value) => ({
              l: STAGE_LABEL[value],
              on: stage === value,
              onSelect: () => setStage(value),
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
            onChange={(e) => setSort(e.target.value as CompanySort)}
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

      <div aria-busy={loading}>
        {state === "error" ? (
          <CompaniesEmpty kind="error" errorMessage={errorMessage} onClearFilters={clearFilters} />
        ) : !loading && items.length === 0 ? (
          <CompaniesEmpty kind={hasFilters ? "filtered" : "none"} onClearFilters={clearFilters} />
        ) : (
          <div className="tablewrap">
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
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="faint">
                          Loading...
                        </td>
                      </tr>
                    ))
                  : items.map((company) => {
                      const hiring = describeHiring(company);
                      return (
                        <tr key={company.id}>
                          <td>
                            <Link href={`/companies/${company.id}`} className="row">
                              <CompanyLogo
                                logoUrl={company.logo_url}
                                seed={company.domain}
                                size="sm"
                              />
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
                    })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {state === "ready" && data && data.items.length > 0 ? (
        <div className="row wrap" style={{ gap: 12, marginTop: 16 }}>
          <span className="sm faint">
            {plural(data.total, "company", "companies")}, page {page} of {totalPages}
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
