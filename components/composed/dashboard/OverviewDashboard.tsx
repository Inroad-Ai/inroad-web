"use client";

import { ActivityChart } from "./overview/ActivityChart";
import { FollowUpList } from "./overview/FollowUpList";
import { deriveOverviewMetrics } from "./overview/overview-metrics";
import { OverviewEmpty } from "./overview/OverviewEmpty";
import { OverviewHero } from "./overview/OverviewHero";
import { OverviewKpis } from "./overview/OverviewKpis";
import { OverviewSkeleton } from "./overview/OverviewSkeleton";
import { PageNotice } from "./PageNotice";
import { PipelineFunnel } from "./overview/PipelineFunnel";
import { RecentActivity } from "./overview/RecentActivity";
import { ResponseRateChart } from "./overview/ResponseRateChart";
import { useOverviewData } from "./overview/useOverviewData";

export function OverviewDashboard() {
  const { state, stats, message, followUps, recent } = useOverviewData();

  if (state === "loading") return <OverviewSkeleton />;
  if (state === "error") {
    return <PageNotice isError>{message}</PageNotice>;
  }
  if (state === "empty") return <OverviewEmpty />;
  if (!stats) return null;

  const metrics = deriveOverviewMetrics(stats);

  return (
    <div className="space-y-5">
      <OverviewHero active={metrics.active} />
      <OverviewKpis stats={stats} metrics={metrics} />
      <div className="grid gap-5 xl:grid-cols-5">
        <div className="grid min-w-0 content-start gap-5 xl:col-span-3">
          <ActivityChart
            weekly={metrics.weekly}
            added={metrics.added}
            hasTrend={metrics.hasActivityTrend}
          />
          {followUps.length > 0 ? <FollowUpList companies={followUps} /> : null}
        </div>
        <div className="grid min-w-0 content-start gap-5 xl:col-span-2">
          <ResponseRateChart
            responseRate={metrics.responseRate}
            progressed={metrics.progressed}
            outreachBase={metrics.outreachBase}
          />
          <PipelineFunnel funnel={metrics.funnel} active={metrics.active} />
          {recent.length > 0 ? <RecentActivity companies={recent} /> : null}
        </div>
      </div>
    </div>
  );
}
