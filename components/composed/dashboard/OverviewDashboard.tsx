"use client";

import { ActivityChart } from "./overview/ActivityChart";
import { FollowUpList } from "./overview/FollowUpList";
import { HiringMomentumChart } from "./overview/HiringMomentumChart";
import { NextStepsSection } from "./overview/NextStepsSection";
import { deriveOverviewMetrics } from "./overview/overview-metrics";
import { OverviewEmpty } from "./overview/OverviewEmpty";
import { OverviewSkeleton } from "./overview/OverviewSkeleton";
import { PipelineChart } from "./overview/PipelineChart";
import { RecentActivity } from "./overview/RecentActivity";
import { SkillsDemandChart } from "./overview/SkillsDemandChart";
import { StatTiles } from "./overview/StatTiles";
import { useOverviewData } from "./overview/useOverviewData";
import { PageNotice } from "./PageNotice";

/** Headline numbers first, then what to do next and where things stand,
 * then the trends behind them, then the lists to work through. */
export function OverviewDashboard() {
  const { state, stats, message, followUps, recent, insights } = useOverviewData();

  if (state === "loading") return <OverviewSkeleton />;
  if (state === "error") {
    return <PageNotice isError>{message}</PageNotice>;
  }
  if (state === "empty") return <OverviewEmpty />;
  if (!stats) return null;

  const metrics = deriveOverviewMetrics(stats);

  return (
    <div className="space-y-5">
      <StatTiles stats={stats} metrics={metrics} insights={insights} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <NextStepsSection steps={insights?.next_steps ?? []} />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <PipelineChart funnel={metrics.funnel} total={stats.total_companies} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ActivityChart
          weekly={metrics.weekly}
          added={metrics.added}
          hasTrend={metrics.hasActivityTrend}
        />
        <HiringMomentumChart hiring={insights?.hiring ?? []} />
      </div>
      <SkillsDemandChart skills={insights?.skills ?? []} roles={insights?.fitting_roles ?? 0} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {followUps.length > 0 ? <FollowUpList companies={followUps} /> : null}
        {recent.length > 0 ? <RecentActivity companies={recent} /> : null}
      </div>
    </div>
  );
}
