"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  PIPELINE_STAGES,
  STAGE_LABEL,
  StatusBadge,
  type PipelineStage,
} from "@/components/ui/StatusBadge";
import { fetchCompanies, fetchOverviewStats } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { formatRelativeDays } from "@/lib/format";
import type { Company, OverviewStats } from "@/lib/types";

// Stages where a company is waiting on the user, not on someone else's reply.
const FOLLOW_UP_STAGES = new Set<PipelineStage>(["researched", "contacted"]);
const FOLLOW_UP_LIMIT = 5;

const TEAL = "rgb(var(--color-signal-teal))";
const AMBER = "rgb(var(--color-signal-amber))";
const SUCCESS = "rgb(var(--color-success))";
const WARNING = "rgb(var(--color-warning))";
const ROSE = "rgb(var(--color-muted-rose))";
const MUTED = "rgb(var(--color-surface-raised))";
const LINE = "rgb(var(--color-line))";
const TEXT = "rgb(var(--color-text-secondary))";

// Mirrors StatusBadge's STAGE_TONE so a stage means the same color everywhere.
const STAGE_COLOR: Record<PipelineStage, string> = {
  researched: TEXT,
  contacted: TEAL,
  responded: TEAL,
  interviewing: SUCCESS,
  closed: WARNING,
  rejected: ROSE,
};

const tooltipStyle = {
  background: "rgb(var(--color-surface))",
  border: "1px solid rgb(var(--color-line))",
  borderRadius: "var(--radius-sm)",
  boxShadow: "var(--shadow-card)",
  fontSize: "0.75rem",
};

type LoadState = "loading" | "error" | "empty" | "ready";

function weekLabel(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function OverviewDashboard() {
  const [state, setState] = useState<LoadState>("loading");
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [message, setMessage] = useState("");
  // Independent of `state` - a follow-up list fetch failing shouldn't blank
  // the whole dashboard, so it's allowed to just stay empty.
  const [followUps, setFollowUps] = useState<Company[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      const token = await ensureValidAccessToken();
      if (!token) {
        setMessage("Your session expired. Sign in again to see your overview.");
        setState("error");
        return;
      }
      try {
        const result = await fetchOverviewStats(token, controller.signal, 30);
        setStats(result);
        setState(result.total_companies ? "ready" : "empty");
      } catch (error) {
        if (!controller.signal.aborted) {
          setMessage(error instanceof Error ? error.message : "Could not load your overview.");
          setState("error");
        }
      }

      try {
        const companies = await fetchCompanies(
          { sort: "updated_asc", pageSize: 25 },
          token,
          controller.signal,
        );
        setFollowUps(
          companies.items
            .filter((company) => FOLLOW_UP_STAGES.has(company.stage))
            .slice(0, FOLLOW_UP_LIMIT),
        );
      } catch {
        // Best-effort widget - leave the list empty on failure.
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  if (state === "loading") return <OverviewSkeleton />;
  if (state === "error") {
    return (
      <div className="mt-8 rounded-lg border border-line bg-surface shadow-card">
        <EmptyState className="px-6 py-16 text-center">{message}</EmptyState>
      </div>
    );
  }
  if (state === "empty") return <EmptyOverview />;
  if (!stats) return null;

  const count = (stage: PipelineStage) => stats.by_stage[stage] ?? 0;
  const researched = count("researched");
  const active = count("contacted") + count("responded") + count("interviewing");
  const progressed = count("responded") + count("interviewing") + count("closed");
  const outreachBase = active + count("closed") + count("rejected");
  const responseRate = outreachBase ? Math.round((progressed / outreachBase) * 100) : 0;
  const activity = stats.companies_by_week.map((item) => ({
    label: weekLabel(item.week_start),
    companies: item.count,
  }));
  const added = activity.reduce((total, item) => total + item.companies, 0);
  const hasActivityTrend = activity.filter((item) => item.companies > 0).length > 1;
  const funnel = PIPELINE_STAGES.filter((stage) => stage !== "rejected").map((stage) => ({
    stage,
    label: STAGE_LABEL[stage],
    count: count(stage),
  }));
  const responses = outreachBase
    ? [
        { name: "Moved forward", value: progressed, color: TEAL },
        { name: "Awaiting reply", value: Math.max(0, outreachBase - progressed), color: MUTED },
      ]
    : [{ name: "No outreach yet", value: 1, color: MUTED }];
  const outreachDelta = stats.contacted_within_window - stats.contacted_within_prior_window;

  return (
    <div className="mt-8 space-y-6">
      <section className="overflow-hidden rounded-lg border border-line bg-gradient-to-br from-signal-teal-subtle/60 via-surface to-surface shadow-card">
        <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="utility-label text-signal-teal">Search momentum</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {active
                ? `${active} companies are active in your pipeline`
                : "Turn research into conversations"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Track the companies you&apos;ve found, the outreach you&apos;ve started, and the
              responses moving your search forward.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <Link
              href="/companies/pipeline"
              className="text-sm font-medium text-signal-teal hover:text-signal-teal-hover"
            >
              View pipeline
            </Link>
            <Button href="/research">Research a company</Button>
          </div>
        </div>
        <div className="grid divide-line border-t border-line bg-surface/60 sm:grid-cols-3 sm:divide-x">
          <Metric
            label="Companies saved"
            value={stats.total_companies}
            context="Across your full search"
          />
          <Metric
            label={`Outreach, last ${stats.contacted_window_days} days`}
            value={stats.contacted_within_window}
            context={
              outreachDelta === 0
                ? "No change from prior period"
                : `${outreachDelta > 0 ? "+" : ""}${outreachDelta} from prior period`
            }
          />
          <Metric
            label="Still in research"
            value={researched}
            context={`${stats.total_companies ? Math.round((researched / stats.total_companies) * 100) : 0}% ready for your next move`}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.85fr)]">
        <ChartCard
          eyebrow="Weekly trend"
          title="Research activity"
          description="Companies added to your search over time."
          aside={`${added} added`}
        >
          <div
            className="h-chart-sm"
            role="img"
            aria-label={`${added} companies added over the displayed weeks.`}
          >
            {hasActivityTrend ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity} margin={{ top: 14, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activity-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={TEAL} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={LINE} strokeDasharray="3 4" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: TEXT, fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: TEXT, fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: LINE }} />
                  <Area
                    type="monotone"
                    dataKey="companies"
                    name="Companies added"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    fill="url(#activity-fill)"
                    activeDot={{
                      r: 5,
                      fill: TEAL,
                      stroke: "rgb(var(--color-surface))",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmpty message="Not enough weeks of activity yet to plot a trend." />
            )}
          </div>
        </ChartCard>
        <ChartCard
          eyebrow="Outreach health"
          title="Response rate"
          description={
            outreachBase
              ? "Share of reached-out companies that moved beyond initial contact."
              : "Start outreach to see response performance."
          }
        >
          <div
            className="relative h-chart-sm"
            role="img"
            aria-label={`Response rate is ${responseRate} percent.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Pie
                  data={responses}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={96}
                  paddingAngle={outreachBase ? 4 : 0}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {responses.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-semibold text-ink">
                {outreachBase ? `${responseRate}%` : "-"}
              </span>
              <span className="mt-1 text-xs text-text-secondary">response rate</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 border-t border-line pt-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal-teal" />
              Moved forward
            </span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-surface-raised ring-1 ring-line"
              />
              Awaiting reply
            </span>
          </div>
        </ChartCard>
      </section>

      <ChartCard
        eyebrow="Current position"
        title="Pipeline funnel"
        description="Companies grouped by current stage. Rejected companies are excluded."
        aside={`${active} active`}
      >
        <div
          className="h-chart-md"
          role="img"
          aria-label={`${active} companies are active in the pipeline.`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnel}
              layout="vertical"
              margin={{ top: 8, right: 28, left: 26, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} stroke={LINE} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: TEXT, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: TEXT, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={84}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgb(var(--color-surface-raised))" }}
              />
              <Bar dataKey="count" name="Companies" radius={[0, 5, 5, 0]} barSize={24}>
                {funnel.map((entry) => (
                  <Cell key={entry.stage} fill={STAGE_COLOR[entry.stage]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {followUps.length > 0 && (
        <ChartCard
          eyebrow="Needs attention"
          title="Follow up next"
          description="Companies that have gone the longest without a status change."
        >
          <ul className="divide-y divide-line">
            {followUps.map((company) => (
              <FollowUpRow key={company.id} company={company} />
            ))}
          </ul>
        </ChartCard>
      )}
    </div>
  );
}

function FollowUpRow({ company }: { company: Company }) {
  return (
    <li>
      <Link
        href={`/companies/${company.id}`}
        className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:opacity-80"
      >
        <CompanyLogo logoUrl={company.logo_url} domain={company.domain} className="h-9 w-9" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            {company.homepage_title || company.domain}
          </p>
          <p className="mt-0.5 text-xs text-text-secondary">
            Updated {formatRelativeDays(company.updated_at)}
          </p>
        </div>
        <StatusBadge stage={company.stage} />
      </Link>
    </li>
  );
}

function Metric({ label, value, context }: { label: string; value: number; context: string }) {
  return (
    <div className="px-6 py-5 sm:px-8">
      <p className="utility-label text-text-secondary">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{context}</p>
    </div>
  );
}

function ChartCard({
  title,
  eyebrow,
  description,
  aside,
  children,
}: {
  title: string;
  eyebrow: string;
  description: string;
  aside?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-surface p-6 shadow-card sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="utility-label text-signal-teal">{eyebrow}</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        </div>
        {aside ? (
          <span className="utility-label rounded-full bg-surface-raised px-3 py-1.5 text-text-secondary">
            {aside}
          </span>
        ) : null}
      </header>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line text-center">
      <span className="text-sm text-text-secondary">{message}</span>
    </div>
  );
}

function EmptyOverview() {
  return (
    <div className="mt-8 rounded-lg border border-line bg-surface shadow-card">
      <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-signal-teal-subtle">
          <span className="h-2.5 w-2.5 rounded-full bg-signal-teal" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink">Your dashboard is ready when you are</h2>
          <EmptyState className="mt-2 max-w-sm">
            Research and save a company to start tracking your search momentum here.
          </EmptyState>
        </div>
        <Button href="/research">Research a company</Button>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-lg border border-line bg-surface p-8">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 h-8 w-72" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="border-t border-line pt-5 sm:border-l sm:border-t-0 sm:pl-6"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-line bg-surface p-7">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-5 w-40" />
            <Skeleton className="mt-2 h-3 w-56" />
            <Skeleton className="mt-7 h-chart-sm w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
