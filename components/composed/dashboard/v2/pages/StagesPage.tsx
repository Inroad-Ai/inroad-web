"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchCompanies } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { companyDisplayName } from "@/lib/company-brief";
import { formatRelativeDays } from "@/lib/format";
import type { Company } from "@/lib/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { STAGE_LABEL } from "@/components/ui/StatusBadge";

import { PipelineBoard } from "../../PipelineBoard";
import { deriveOverviewMetrics } from "../../overview/overview-metrics";
import { useOverviewData } from "../../overview/useOverviewData";
import { Ic, Status, Views } from "../kit";
import { NEXT_STEP, nextStepHint, nextStepHref } from "../next-step";
import { sampleFit } from "../sample";

type Mode = "board" | "table" | "timeline";

const STAGE_TONE = {
  researched: "faint",
  contacted: "teal",
  responded: "amber",
  interviewing: "teal",
  closed: "ochre",
  rejected: "rose",
} as const;

const DAY_MS = 86_400_000;

function bucketOf(company: Company): string {
  const days = (Date.now() - Date.parse(company.updated_at)) / DAY_MS;
  if (days < 1) return "Today";
  if (days < 7) return "This week";
  if (days < 30) return "This month";
  return "Earlier";
}

const BUCKETS = ["Today", "This week", "This month", "Earlier"];

/** Companies for the Table and Timeline views; the Board loads its own columns. */
function useAllCompanies(enabled: boolean) {
  const [items, setItems] = useState<Company[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled || items !== null) return;
    const controller = new AbortController();
    void (async () => {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          setError("Your session expired. Sign in again to see your companies.");
          return;
        }
        const response = await fetchCompanies(
          { sort: "updated_desc", page: 1, pageSize: 100 },
          token,
          controller.signal,
        );
        setItems(response.items);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Could not load companies.");
      }
    })();
    return () => controller.abort();
  }, [enabled, items]);

  return { items, error };
}

export function StagesPage() {
  const [mode, setMode] = useState<Mode>("board");
  const { stats } = useOverviewData();
  const [quiet, setQuiet] = useState(0);
  const { items, error } = useAllCompanies(mode !== "board");
  const metrics = stats ? deriveOverviewMetrics(stats) : null;

  return (
    <>
      <div className="row head">
        <div>
          <h1 className="t">Stages</h1>
          <div className="sub">Drag a card to move it. Each card shows what to do next.</div>
        </div>
      </div>

      {metrics && metrics.outreachBase > 0 ? (
        <div className="sm" style={{ marginTop: 18, color: "rgb(var(--color-ink-muted))" }}>
          <b className="green">{metrics.responseRate}% reply rate</b> and{" "}
          <span title="Sample value">3.1 days to reply</span>.{" "}
          {quiet > 0 ? (
            <>
              <span className="rose">
                {quiet === 1 ? "1 conversation has" : `${quiet} conversations have`} been quiet for
                over 7 days.
              </span>{" "}
              <Link href="/contacts" className="amber m">
                Nudge them
              </Link>
            </>
          ) : null}
        </div>
      ) : null}

      <div style={{ margin: "22px 0 26px" }}>
        <Views
          items={[
            { l: "Board", icon: "kanban", on: mode === "board", onSelect: () => setMode("board") },
            { l: "Table", icon: "layers", on: mode === "table", onSelect: () => setMode("table") },
            {
              l: "Timeline",
              icon: "cal",
              on: mode === "timeline",
              onSelect: () => setMode("timeline"),
            },
          ]}
        />
      </div>

      {mode === "board" ? <PipelineBoard onQuietChange={setQuiet} /> : null}

      {mode !== "board" && error ? <p className="sm rose">{error}</p> : null}
      {mode !== "board" && !error && items === null ? (
        <p className="sm faint">Loading companies...</p>
      ) : null}

      {mode === "table" && items ? (
        <div className="tablewrap">
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 280 }}>Company</th>
                <th>Stage</th>
                <th>Fit</th>
                <th>Last researched</th>
                <th>Next step</th>
              </tr>
            </thead>
            <tbody>
              {items.map((company) => (
                <tr key={company.id}>
                  <td>
                    <Link href={`/companies/${company.id}`} className="row">
                      <CompanyLogo logoUrl={company.logo_url} seed={company.domain} size="sm" />
                      <span className="m">{companyDisplayName(company)}</span>
                    </Link>
                  </td>
                  <td>
                    <Status tone={STAGE_TONE[company.stage]}>{STAGE_LABEL[company.stage]}</Status>
                  </td>
                  <td className="num">{sampleFit(company.id)}</td>
                  <td className="muted">{formatRelativeDays(company.updated_at)}</td>
                  <td>
                    <Link
                      href={nextStepHref(company)}
                      className="row muted"
                      style={{ gap: 6 }}
                      title={nextStepHint(company)}
                    >
                      {NEXT_STEP[company.stage]}
                      <Ic n="arrow" size="xs" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {mode === "timeline" && items ? (
        <div style={{ maxWidth: 760 }}>
          {BUCKETS.map((bucket) => {
            const inBucket = items.filter((company) => bucketOf(company) === bucket);
            if (inBucket.length === 0) return null;
            return (
              <section key={bucket} style={{ marginBottom: 26 }}>
                <div className="xs faint" style={{ marginBottom: 6 }}>
                  {bucket}
                </div>
                <div className="list">
                  {inBucket.map((company) => (
                    <Link key={company.id} href={`/companies/${company.id}`}>
                      <CompanyLogo logoUrl={company.logo_url} seed={company.domain} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="m">{companyDisplayName(company)}</div>
                        <div className="xs faint">
                          {STAGE_LABEL[company.stage]} · updated{" "}
                          {formatRelativeDays(company.updated_at)}
                        </div>
                      </div>
                      <Status tone={STAGE_TONE[company.stage]} />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
          {items.length === 0 ? <p className="sm muted">Nothing here yet.</p> : null}
        </div>
      ) : null}
    </>
  );
}
