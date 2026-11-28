"use client";

import { useProfile } from "@/hooks/useProfile";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";

import { PageNotice } from "../PageNotice";
import { deriveOverviewMetrics } from "../overview/overview-metrics";
import { useOverviewData } from "../overview/useOverviewData";
import { useRecentlyFunded } from "../overview/useRecentlyFunded";
import { TodayAside } from "./TodayAside";
import { TodayFirstRun } from "./TodayFirstRun";
import { TodayFunded } from "./TodayFunded";
import { TodayMoves } from "./TodayMoves";
import { TodayPipeline } from "./TodayPipeline";
import { TodaySkeleton } from "./TodaySkeleton";
import { formatToday, greetingFor } from "./today-greeting";
import { deriveMoves } from "./today-moves";

const FUNDED_SHOWN = 4;

export function TodayDashboard() {
  const { state, stats, message, followUps, insights } = useOverviewData();
  const { profile } = useProfile();
  const funded = useRecentlyFunded();

  if (state === "loading") return <TodaySkeleton />;
  if (state === "error") return <PageNotice isError>{message}</PageNotice>;
  if (state === "empty") return <TodayFirstRun profile={profile} funded={funded} />;
  if (!stats) return null;

  const metrics = deriveOverviewMetrics(stats);
  const moves = deriveMoves(insights?.next_steps ?? [], followUps);
  const now = new Date();
  const name = profile?.first_name;

  return (
    <div className="grid gap-12 xl:grid-cols-main-aside">
      <div className="min-w-0 max-w-3xl">
        <p className="text-sm text-ink-muted">{formatToday(now)}</p>
        <h2 className="mt-2 font-display text-4xl font-sans-semibold tracking-display text-ink">
          {greetingFor(now)}
          {name ? `, ${name}.` : "."}
        </h2>
        <p className="mt-3 text-ink-muted">
          {moves.length > 0
            ? "Here is what is worth doing today. Everything else can wait."
            : "Nothing is waiting on you right now."}
        </p>

        <Section title="Today" className="mt-10">
          <TodayMoves moves={moves} />
        </Section>
        {funded.length > 0 ? (
          <Section
            title="New for you"
            className="mt-10"
            action={<TextLink href="/research?mode=match">Find more</TextLink>}
          >
            <TodayFunded items={funded.slice(0, FUNDED_SHOWN)} />
          </Section>
        ) : null}
        <Section
          title="Your pipeline"
          className="mt-10"
          action={<TextLink href="/companies/pipeline">Open stages</TextLink>}
        >
          <TodayPipeline metrics={metrics} waiting={followUps.length} />
        </Section>
      </div>
      <TodayAside
        saved={stats.total_companies}
        fittingRoles={insights ? insights.fitting_roles : null}
        metrics={metrics}
      />
    </div>
  );
}
