"use client";

import { useCallback, useEffect, useState } from "react";

import { OverviewCharts } from "@/components/composed/dashboard/overview/OverviewCharts";
import { SetupChecklist } from "@/components/composed/dashboard/overview/SetupChecklist";
import { TodayPanel } from "@/components/composed/dashboard/overview/TodayPanel";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatTile } from "@/components/ui/StatTile";
import { SESSION_EXPIRED } from "@/hooks/useAsyncResource";
import { useOverviewResource } from "@/hooks/useOverviewResource";
import {
  fetchOverviewActions,
  fetchOverviewStats,
  fetchPeopleOverview,
} from "@/lib/api-client/client";
import { activeCompanyCount } from "@/lib/pipeline-metrics";
import { MILLISECONDS_PER_DAY } from "@/lib/format";

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

function freshness(value: Date): string {
  const minutes = Math.floor((Date.now() - value.getTime()) / 60_000);
  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} min ago`;
  return `Updated ${Math.floor(minutes / 60)} hr ago`;
}

function SectionFailure({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 rounded-md border border-line bg-surface p-5 text-sm text-muted-rose shadow-card"
    >
      <span>{message}</span>
      <Button variant="quiet" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function TileSkeletons({ count }: { count: number }) {
  return (
    <div
      role="status"
      aria-label="Loading overview numbers"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-md border border-line bg-surface p-5 shadow-card">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-3 h-8 w-16" />
          <Skeleton className="mt-3 h-3 w-40" />
        </div>
      ))}
    </div>
  );
}

export function OverviewDashboard() {
  const [range, setRange] = useState<Range>(30);
  const [, setClock] = useState(0);
  const statsLoader = useCallback(
    (token: string, signal: AbortSignal) => fetchOverviewStats(token, signal, range),
    [range],
  );
  const actionLoader = useCallback(
    (token: string, signal: AbortSignal) => fetchOverviewActions(token, signal),
    [],
  );
  const peopleLoader = useCallback(
    (token: string, signal: AbortSignal) => fetchPeopleOverview(token, signal),
    [],
  );
  const stats = useOverviewResource(statsLoader);
  const actions = useOverviewResource(actionLoader);
  const people = useOverviewResource(peopleLoader);

  useEffect(() => {
    const timer = window.setInterval(() => setClock((value) => value + 1), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const sessionExpired = [stats.error, actions.error, people.error].includes(SESSION_EXPIRED);
  const updatedTimes = [stats.updatedAt, actions.updatedAt, people.updatedAt]
    .filter((value): value is Date => value !== null)
    .map((value) => value.getTime());
  const oldestUpdate = updatedTimes.length ? new Date(Math.min(...updatedTimes)) : null;

  if (sessionExpired) {
    return (
      <div className="mt-8 rounded-md border border-line bg-surface p-6 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Your session expired</h2>
        <p className="mt-2 text-sm text-text-secondary">Sign in again to see your overview.</p>
        <Button href="/login" className="mt-5">
          Sign in
        </Button>
      </div>
    );
  }

  const companyStats = stats.data;
  const peopleStats = people.data;
  const outreachDelta = companyStats
    ? companyStats.contacted_within_window - companyStats.contacted_within_prior_window
    : 0;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-text-secondary" role="status">
          {oldestUpdate ? freshness(oldestUpdate) : "Waiting for your latest activity"}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="overview-range" className="text-sm text-text-secondary">
            Outreach range
          </label>
          <Select
            id="overview-range"
            aria-label="Outreach date range"
            value={range}
            onChange={(event) => setRange(Number(event.target.value) as Range)}
          >
            {RANGES.map((days) => (
              <option key={days} value={days}>
                Last {days} days
              </option>
            ))}
          </Select>
          <Button
            variant="quiet"
            size="sm"
            onClick={() => {
              void stats.retry();
              void actions.retry();
              void people.retry();
            }}
            disabled={stats.loading && actions.loading && people.loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      <TodayPanel
        data={actions.data}
        loading={actions.loading}
        error={actions.error}
        onRetry={() => void actions.retry()}
      />

      <SetupChecklist
        stats={companyStats}
        statsLoading={stats.loading}
        statsError={stats.error}
        onStatsRetry={() => void stats.retry()}
      />

      <section aria-label="Company overview" aria-busy={stats.loading} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="utility-label text-signal-teal">At a glance</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">Your search</h2>
          </div>
          <Button href="/research" variant="quiet" size="sm">
            Research a company
          </Button>
        </div>
        {stats.error ? (
          <SectionFailure message={stats.error} onRetry={() => void stats.retry()} />
        ) : null}
        {!companyStats && stats.loading ? <TileSkeletons count={4} /> : null}
        {companyStats ? (
          <div
            className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${stats.loading ? "opacity-60" : ""}`}
          >
            <StatTile
              label="Companies saved"
              value={companyStats.total_companies}
              context="Across your search"
              href="/companies"
            />
            <StatTile
              label={`Outreach, last ${companyStats.contacted_window_days} days`}
              value={companyStats.contacted_within_window}
              context={
                outreachDelta === 0
                  ? "No change from the previous period"
                  : `${outreachDelta > 0 ? "+" : ""}${outreachDelta} from the previous period`
              }
              href={`/companies?contacted_after=${encodeURIComponent(new Date(Date.now() - companyStats.contacted_window_days * MILLISECONDS_PER_DAY).toISOString())}`}
            />
            <StatTile
              label="Still in research"
              value={companyStats.by_stage.researched ?? 0}
              context="Companies ready for your next move"
              href="/companies/pipeline?stage=researched"
            />
            <StatTile
              label="Response rate"
              value={
                companyStats.contacted_companies ? `${companyStats.response_rate_percent}%` : "—"
              }
              context={
                companyStats.contacted_companies
                  ? `${companyStats.replied_companies} of ${companyStats.contacted_companies} contacted companies are Responded or Interviewing`
                  : "No companies contacted yet"
              }
              href="/companies?contacted_only=true"
            />
          </div>
        ) : null}
      </section>

      <section aria-label="People overview" aria-busy={people.loading} className="space-y-4">
        <div>
          <p className="utility-label text-signal-teal">People</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">Conversations</h2>
        </div>
        {people.error ? (
          <SectionFailure message={people.error} onRetry={() => void people.retry()} />
        ) : null}
        {!peopleStats && people.loading ? <TileSkeletons count={2} /> : null}
        {peopleStats ? (
          <div className={`grid gap-4 sm:grid-cols-2 ${people.loading ? "opacity-60" : ""}`}>
            <StatTile
              label="People contacted"
              value={peopleStats.contacted_people}
              context="People with a recorded first contact"
              href="/contacts?contacted_only=true"
            />
            <StatTile
              label="Replies"
              value={peopleStats.by_stage.replied ?? 0}
              context="People currently in Replied"
              href="/contacts?stage=replied"
            />
          </div>
        ) : null}
      </section>

      {companyStats ? (
        <section
          aria-label="Search charts"
          className={stats.loading ? "opacity-60" : ""}
          aria-busy={stats.loading}
        >
          <OverviewCharts stats={companyStats} />
        </section>
      ) : null}
    </div>
  );
}
