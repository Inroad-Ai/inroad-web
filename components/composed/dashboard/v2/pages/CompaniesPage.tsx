"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";

import { fetchCompanies } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { SESSION_EXPIRED, describeHiring } from "@/lib/companies";
import { companyDisplayName } from "@/lib/company-brief";
import { formatRelativeDays, plural } from "@/lib/format";
import type { Company, CompanySort } from "@/lib/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Notice } from "@/components/ui/Notice";
import { PIPELINE_STAGES, STAGE_LABEL, type PipelineStage } from "@/components/ui/StatusBadge";

import { CompaniesEmpty } from "../../companies/CompaniesEmpty";
import { MatchProgressNotice } from "../../companies/MatchProgressNotice";
import { Btn, Ic, Status, Tag, Views } from "../kit";
import { NEXT_STEP, nextStepHint, nextStepHref } from "../next-step";
import { EXTRA_COLUMNS, sampleExtra, sampleFit, sampleFunding, type ExtraColumn } from "../sample";

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

type ViewId = "all" | "shortlist" | "funded" | "hiring" | "stealth" | string;

interface SavedView {
  id: string;
  name: string;
  stage: PipelineStage | "all";
  search: string;
}

/** A reply waiting on you is the loudest; a closed company asks nothing. */
function nextStepWeight(stage: PipelineStage): string {
  if (stage === "closed" || stage === "rejected") return "done";
  return stage === "responded" ? "urgent" : "";
}

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

const SUGGESTED = ["hiring-manager", "visa", "tech-overlap"];

export function CompaniesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<PipelineStage | "all">("all");
  const [sort, setSort] = useState<CompanySort>("updated_desc");
  const [page, setPage] = useState(1);

  // Saved views, shortlist and extra columns live in this browser only.
  const [view, setView] = useState<ViewId>("all");
  const [starred, setStarred] = useState<ReadonlySet<string>>(new Set());
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [naming, setNaming] = useState(false);
  const [viewName, setViewName] = useState("");
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelQuery, setPanelQuery] = useState("");
  const [importNote, setImportNote] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Results by query. A tab you have already opened shows instantly while a
  // fresh copy loads behind it.
  const cache = useRef(new Map<string, Result>());
  const [lastShown, setLastShown] = useState<Result | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshQuietly = useCallback(() => setRefreshKey((value) => value + 1), []);

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
    setView("all");
    setPage(1);
  }

  function applyView(id: ViewId) {
    setView(id);
    const custom = savedViews.find((saved) => saved.id === id);
    if (custom) {
      setStage(custom.stage);
      setSearchInput(custom.search);
      setSearch(custom.search);
      setPage(1);
    }
  }

  function saveView() {
    const name = viewName.trim();
    if (!name) return;
    const id = `custom-${Date.now()}`;
    setSavedViews((current) => [...current, { id, name, stage, search }]);
    setView(id);
    setViewName("");
    setNaming(false);
  }

  function toggleStar(id: string) {
    setStarred((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addColumn(id: string) {
    setExtraIds((current) => (current.includes(id) ? current : [...current, id]));
    setPanelOpen(false);
    setPanelQuery("");
  }

  async function onImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim()).length;
    const rows = Math.max(0, lines - 1);
    setImportNote(
      `Preview: found ${plural(rows, "row", "rows")} in ${file.name}. Importing from a file is not connected yet, so nothing was added.`,
    );
  }

  const rawItems = shown?.items ?? [];
  const items = rawItems.filter((company) => {
    if (view === "shortlist") return starred.has(company.id);
    if (view === "funded") return sampleFunding(company.id) !== "Seed";
    if (view === "hiring") return (company.open_roles ?? 0) > 0;
    if (view === "stealth") return sampleFunding(company.id) === "Seed";
    return true;
  });
  const total = shown?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = search !== "" || stage !== "all" || view !== "all";
  const firstLoad = shown === null && !errorMessage;
  const failed = shown === null && Boolean(errorMessage);
  const nothingAtAll = shown !== null && total === 0 && !hasFilters;
  // The rows on screen belong to another query until this one answers.
  const stale = cached === null && shown !== null;
  const extras = extraIds
    .map((id) => EXTRA_COLUMNS.find((column) => column.id === id))
    .filter((column): column is ExtraColumn => Boolean(column));
  const colSpan = 8 + extras.length;
  const panelColumns = EXTRA_COLUMNS.filter(
    (column) =>
      !extraIds.includes(column.id) &&
      column.label.toLowerCase().includes(panelQuery.trim().toLowerCase()),
  );

  const counts: Record<string, number> = {
    shortlist: rawItems.filter((c) => starred.has(c.id)).length,
    funded: rawItems.filter((c) => sampleFunding(c.id) !== "Seed").length,
    hiring: rawItems.filter((c) => (c.open_roles ?? 0) > 0).length,
    stealth: rawItems.filter((c) => sampleFunding(c.id) === "Seed").length,
  };

  return (
    <div style={{ position: "relative" }}>
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
        <input
          ref={fileInput}
          type="file"
          accept=".csv,text/csv"
          hidden
          aria-label="Import companies from a CSV file"
          onChange={onImport}
        />
        <Btn icon="up" onClick={() => fileInput.current?.click()}>
          Import
        </Btn>
        <Btn kind="p" icon="search" href="/research">
          Research a company
        </Btn>
      </div>

      {importNote ? (
        <div style={{ marginTop: 14 }}>
          <Notice boxed>{importNote}</Notice>
        </div>
      ) : null}

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

      <div
        className="row wrap"
        style={{ gap: 8, margin: "14px 0 4px" }}
        role="group"
        aria-label="Saved views"
      >
        <span className="sm faint" style={{ marginRight: 4 }}>
          Views
        </span>
        {(
          [
            ["all", "All", undefined],
            ["shortlist", "Shortlist", counts.shortlist],
            ["funded", "Funded", counts.funded],
            ["hiring", "Hiring now", counts.hiring],
            ["stealth", "Stealth", counts.stealth],
          ] as [ViewId, string, number | undefined][]
        ).map(([id, label, n]) => (
          <button
            key={id}
            type="button"
            className={`pill ${view === id ? "on" : ""}`}
            style={{ height: 30, fontSize: 13 }}
            aria-pressed={view === id}
            onClick={() => setView(id)}
          >
            {label}
            {n !== undefined ? <span className="faint xs">{n}</span> : null}
          </button>
        ))}
        {savedViews.map((saved) => (
          <button
            key={saved.id}
            type="button"
            className={`pill ${view === saved.id ? "on" : ""}`}
            style={{ height: 30, fontSize: 13 }}
            aria-pressed={view === saved.id}
            onClick={() => applyView(saved.id)}
          >
            {saved.name}
          </button>
        ))}
        {naming ? (
          <form
            className="row"
            style={{ gap: 6 }}
            onSubmit={(event) => {
              event.preventDefault();
              saveView();
            }}
          >
            <input
              className="field"
              style={{ height: 30, width: 150, fontSize: 13 }}
              value={viewName}
              onChange={(event) => setViewName(event.target.value)}
              placeholder="Name this view"
              aria-label="Name for the new view"
            />
            <button type="submit" className="btn sm p" disabled={!viewName.trim()}>
              Save
            </button>
            <button type="button" className="btn sm t" onClick={() => setNaming(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <button type="button" className="btn t sm" onClick={() => setNaming(true)}>
            + New view
          </button>
        )}
      </div>

      <div className="row wrap" style={{ gap: 14, margin: "10px 0 4px" }}>
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
        <span className="sm faint">
          {items.length} of {total}
        </span>
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
                  <Th icon="target">Fit</Th>
                </th>
                <th>
                  <Th icon="kanban">Stage</Th>
                </th>
                <th>
                  <Th icon="dollar">Funding</Th>
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
                {extras.map((column) => (
                  <th key={column.id}>
                    <span className="ci">
                      <Ic n={column.icon} size="xs" />
                      {column.label}
                      <button
                        type="button"
                        className="faint"
                        aria-label={`Remove the ${column.label} column`}
                        onClick={() =>
                          setExtraIds((current) => current.filter((id) => id !== column.id))
                        }
                      >
                        <Ic n="x" size="xs" />
                      </button>
                    </span>
                  </th>
                ))}
                <th style={{ width: 70 }}>
                  <button
                    type="button"
                    aria-label="Add a column"
                    aria-expanded={panelOpen}
                    onClick={() => setPanelOpen((open) => !open)}
                  >
                    <Ic n="plus" size="s" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {firstLoad ? (
                <tr>
                  <td colSpan={colSpan} className="faint">
                    Loading companies...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} style={{ height: 120 }}>
                    <span className="muted">
                      {view === "shortlist"
                        ? "Star a company to add it to your shortlist."
                        : stage === "all"
                          ? "No companies match that."
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
                  const fit = sampleFit(company.id);
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
                      <td className="num">
                        <b className={fit > 85 ? "green" : ""}>{fit}</b>
                      </td>
                      <td>
                        <Status tone={STAGE_TONE[company.stage]}>
                          {STAGE_LABEL[company.stage]}
                        </Status>
                      </td>
                      <td>{sampleFunding(company.id)}</td>
                      <td className={hiring.muted ? "muted" : "m"}>{hiring.label}</td>
                      <td className="muted">{formatRelativeDays(company.updated_at)}</td>
                      <td>
                        <Link
                          href={nextStepHref(company)}
                          className={`next-step ${nextStepWeight(company.stage)}`}
                          title={nextStepHint(company)}
                        >
                          {NEXT_STEP[company.stage]}
                          <Ic n="arrow" size="xs" />
                        </Link>
                      </td>
                      {extras.map((column) => (
                        <td key={column.id} className="muted">
                          {sampleExtra(column.id, company.id)}
                        </td>
                      ))}
                      <td>
                        <button
                          type="button"
                          aria-pressed={starred.has(company.id)}
                          aria-label={
                            starred.has(company.id)
                              ? `Remove ${company.domain} from the shortlist`
                              : `Add ${company.domain} to the shortlist`
                          }
                          className={starred.has(company.id) ? "amber" : "faint"}
                          onClick={() => toggleStar(company.id)}
                        >
                          <Ic n="star" size="s" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {panelOpen ? (
        <>
          <button
            type="button"
            aria-label="Close the column panel"
            tabIndex={-1}
            onClick={() => setPanelOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 15,
              background: "transparent",
              cursor: "default",
            }}
          />
          <div
            className="pop addcol"
            role="dialog"
            aria-label="Add a column"
            style={{ right: 0, top: 330, width: 420, padding: "18px 20px", maxWidth: "100%" }}
          >
            <div className="row" style={{ marginBottom: 12 }}>
              <b>Add a column</b>
              <span className="sp" />
              <label className="field" style={{ height: 30, width: 150, fontSize: 13 }}>
                <Ic n="search" size="xs" />
                <input
                  value={panelQuery}
                  onChange={(event) => setPanelQuery(event.target.value)}
                  placeholder="Search"
                  aria-label="Search columns"
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
            </div>
            {panelQuery === "" ? (
              <div className="note teal" style={{ marginBottom: 14, display: "block" }}>
                <div className="xs" style={{ opacity: 0.8, marginBottom: 6 }}>
                  Suggested for this table
                </div>
                <div className="row wrap" style={{ gap: 8 }}>
                  {SUGGESTED.filter((id) => !extraIds.includes(id)).map((id) => {
                    const column = EXTRA_COLUMNS.find((c) => c.id === id);
                    return column ? (
                      <button key={id} type="button" onClick={() => addColumn(id)}>
                        <Tag tone="teal" icon="spark">
                          {column.label}
                        </Tag>
                      </button>
                    ) : null;
                  })}
                  {SUGGESTED.every((id) => extraIds.includes(id)) ? (
                    <span className="xs">All suggested columns are added.</span>
                  ) : null}
                </div>
              </div>
            ) : null}
            {(["Find", "People", "Signals"] as const).map((group) => {
              const inGroup = panelColumns.filter((column) => column.group === group);
              if (inGroup.length === 0) return null;
              return (
                <div
                  key={group}
                  style={{ padding: "8px 0", borderTop: "1px solid rgb(var(--color-line))" }}
                >
                  <div className="xs faint" style={{ marginBottom: 6 }}>
                    {group}
                  </div>
                  <div className="row wrap" style={{ gap: 8 }}>
                    {inGroup.map((column) => (
                      <button
                        key={column.id}
                        type="button"
                        className="pill"
                        style={{ height: 28, fontSize: 13 }}
                        onClick={() => addColumn(column.id)}
                      >
                        <Ic n={column.icon} size="xs" />
                        {column.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {panelColumns.length === 0 ? (
              <div className="sm muted">Nothing matches that.</div>
            ) : null}
          </div>
        </>
      ) : null}

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
