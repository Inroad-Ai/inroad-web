"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { fetchOverviewStats } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { OverviewStats } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { PIPELINE_STAGES, STAGE_LABEL } from "@/components/ui/StatusBadge";

const CONTACTED_WINDOW_DAYS = 30;

type LoadState = "loading" | "error" | "empty" | "ready";

function formatWeekLabel(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatDelta(current: number, prior: number): string {
  const diff = current - prior;
  if (diff === 0) return "no change";
  return diff > 0 ? `+${diff}` : `${diff}`;
}

export function OverviewDashboard() {
  const [state, setState] = useState<LoadState>("loading");
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setState("loading");
      const token = await ensureValidAccessToken();
      if (!token) {
        setErrorMessage("Your session expired. Sign in again to see your overview.");
        setState("error");
        return;
      }

      try {
        const response = await fetchOverviewStats(
          token,
          controller.signal,
          CONTACTED_WINDOW_DAYS,
        );
        setStats(response);
        setState(response.total_companies === 0 ? "empty" : "ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        setErrorMessage(err instanceof Error ? err.message : "Could not load your overview.");
        setState("error");
      }
    }

    load();
    return () => controller.abort();
  }, []);

  if (state === "error") {
    return (
      <div className="mt-6 rounded-md border border-line bg-surface">
        <EmptyState className="px-6 py-16 text-center">{errorMessage}</EmptyState>
      </div>
    );
  }

  if (state === "loading") {
    return <OverviewSkeleton />;
  }

  if (state === "empty") {
    return (
      <div className="mt-6 rounded-md border border-line bg-surface">
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <EmptyState>
            Nothing to show yet. Your overview fills in once you&apos;ve researched and saved a
            company.
          </EmptyState>
          <Button href="/research">Research a company</Button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const researched = stats.by_stage.researched ?? 0;
  const researchedShare =
    stats.total_companies > 0 ? Math.round((researched / stats.total_companies) * 100) : 0;

  const funnelData = PIPELINE_STAGES.map((stage) => ({
    stage,
    label: STAGE_LABEL[stage],
    count: stats.by_stage[stage] ?? 0,
  }));

  const weeklyData = stats.companies_by_week.map((bucket) => ({
    label: formatWeekLabel(bucket.week_start),
    count: bucket.count,
  }));

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total companies"
          value={stats.total_companies}
          context="Saved across every stage"
        />
        <KpiCard
          label="Researched"
          value={researched}
          context={`${researchedShare}% of total`}
        />
        <KpiCard
          label={`Reached out, last ${stats.contacted_window_days} days`}
          value={stats.contacted_within_window}
          context={`${formatDelta(stats.contacted_within_window, stats.contacted_within_prior_window)} vs the ${stats.contacted_window_days} days before that`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Pipeline by stage" description="Where saved companies sit right now.">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={funnelData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgb(var(--color-line))" />
              <XAxis
                dataKey="label"
                tick={{ fill: "rgb(var(--color-text-secondary))", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "rgb(var(--color-line))" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "rgb(var(--color-text-secondary))", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <Tooltip
                cursor={{ fill: "rgb(var(--color-surface-raised))" }}
                contentStyle={{
                  background: "rgb(var(--color-surface))",
                  border: "1px solid rgb(var(--color-line))",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                }}
                labelStyle={{ color: "rgb(var(--color-ink))" }}
              />
              <Bar dataKey="count" fill="rgb(var(--color-signal-teal))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Companies added"
          description={`Last ${weeklyData.length} weeks, by week saved.`}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgb(var(--color-line))" />
              <XAxis
                dataKey="label"
                tick={{ fill: "rgb(var(--color-text-secondary))", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "rgb(var(--color-line))" }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "rgb(var(--color-text-secondary))", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <Tooltip
                cursor={{ stroke: "rgb(var(--color-line))" }}
                contentStyle={{
                  background: "rgb(var(--color-surface))",
                  border: "1px solid rgb(var(--color-line))",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                }}
                labelStyle={{ color: "rgb(var(--color-ink))" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="rgb(var(--color-signal-amber))"
                strokeWidth={2}
                dot={{ r: 3, fill: "rgb(var(--color-signal-amber))", strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  context,
}: {
  label: string;
  value: number;
  context: string;
}) {
  return (
    <div className="rounded-md border border-line bg-surface p-6">
      <p className="utility-label text-text-secondary">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{context}</p>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-line bg-surface p-6">
      <p className="text-sm text-ink">{title}</p>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-md border border-line bg-surface p-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-md border border-line bg-surface p-6">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-2 h-3 w-48" />
            <Skeleton className="mt-6 h-[260px] w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
