"use client";

import Link from "next/link";

import { useProfile } from "@/hooks/useProfile";
import { formatAmountUsd, plural } from "@/lib/format";

import { PageNotice } from "../../PageNotice";
import { deriveOverviewMetrics } from "../../overview/overview-metrics";
import { useOverviewData } from "../../overview/useOverviewData";
import { useRecentlyFunded } from "../../overview/useRecentlyFunded";
import { TodayFirstRun } from "../../today/TodayFirstRun";
import { TodaySkeleton } from "../../today/TodaySkeleton";
import { formatToday, greetingFor } from "../../today/today-greeting";
import { deriveMoves } from "../../today/today-moves";
import { Bar, Btn, Hair, Ic, Lm, Section, Spark, Status, Tag } from "../kit";

const SHOWN_STAGES = ["researched", "contacted", "responded", "interviewing"];
const FUNDED_SHOWN = 4;

export function TodayPage() {
  const { state, stats, message, followUps, insights } = useOverviewData();
  const { profile } = useProfile();
  const funded = useRecentlyFunded();

  if (state === "loading") return <TodaySkeleton />;
  if (state === "error") return <PageNotice isError>{message}</PageNotice>;
  if (state === "empty") return <TodayFirstRun profile={profile} funded={funded} />;
  if (!stats) return null;

  const metrics = deriveOverviewMetrics(stats);
  const moves = deriveMoves(insights?.next_steps ?? [], followUps);
  const funnel = metrics.funnel.filter((row) => SHOWN_STAGES.includes(row.stage));
  const now = new Date();
  const name = profile?.first_name;

  return (
    <div className="split" style={{ display: "flex", gap: 44 }}>
      <div style={{ flex: 1, minWidth: 0, maxWidth: 780 }}>
        <div className="muted sm" style={{ marginBottom: 10 }}>
          {formatToday(now)}
        </div>
        <h1 className="t" style={{ fontSize: 36 }}>
          {greetingFor(now)}
          {name ? `, ${name}.` : "."}
        </h1>
        <div className="sub">
          {moves.length > 0
            ? "Here is what is worth doing today. Everything else can wait."
            : "Nothing is waiting on you right now."}
        </div>

        <Section title="Today" style={{ marginTop: 28 }}>
          {moves.length === 0 ? (
            <p className="sm muted" style={{ padding: "12px 0" }}>
              You are caught up. Research a company or run a match to find your next one.
            </p>
          ) : (
            <div className="list">
              {moves.map((move, index) => (
                <div key={move.companyId}>
                  <Status tone={index === 0 ? "amber" : "teal"} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="m" style={{ fontSize: 15 }}>
                      {move.title}
                    </div>
                    {move.detail ? (
                      <div className="sm muted" style={{ marginTop: 2 }}>
                        {move.detail}
                      </div>
                    ) : null}
                  </div>
                  <Btn kind={index === 0 ? "p sm" : "sm"} href={`/companies/${move.companyId}`}>
                    Open
                  </Btn>
                </div>
              ))}
            </div>
          )}
        </Section>

        {funded.length > 0 ? (
          <Section title="New for you" right={<Link href="/research?mode=match">Find more</Link>}>
            <div className="list">
              {funded.slice(0, FUNDED_SHOWN).map((company) => {
                const companyName = company.company_name ?? company.domain;
                const raised = [company.stage, formatAmountUsd(company.amount_usd)]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <div key={`${company.domain}-${company.announced_on}`}>
                    <Lm i={companyName[0]?.toUpperCase()} c={(companyName.length % 6) + 1} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="m">
                        {company.company_id ? (
                          <Link href={`/companies/${company.company_id}`}>{companyName}</Link>
                        ) : (
                          companyName
                        )}
                      </div>
                      <div className="xs faint" style={{ marginTop: 1 }}>
                        {[company.best_role.title, raised || "Raised funding"].join(" · ")}
                      </div>
                    </div>
                    {company.best_role.match.band === "strong" ? (
                      <Tag tone="green">Strong</Tag>
                    ) : null}
                    <span className="green m" style={{ width: 44, textAlign: "right" }}>
                      {company.best_role.match.score}%
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>
        ) : null}

        <Section title="Your pipeline" right={<Link href="/companies/pipeline">Open stages</Link>}>
          <div className="row" style={{ gap: 0, alignItems: "flex-end" }}>
            {funnel.map((row, i) => (
              <div
                key={row.stage}
                className="row"
                style={{ gap: 0, alignItems: "flex-end", flex: 1 }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.03em" }}>
                    {row.count}
                  </div>
                  <div className="xs faint">{row.label}</div>
                </div>
                {i < funnel.length - 1 ? (
                  <span className="faint" style={{ padding: "0 6px 14px" }}>
                    <Ic n="chev" size="s" />
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <div className="sm muted" style={{ marginTop: 12 }}>
            {metrics.outreachBase > 0 ? (
              <>
                Response rate <b className="green">{metrics.responseRate}%</b>.{" "}
              </>
            ) : (
              "Reach out to your first company to start tracking replies. "
            )}
            {followUps.length > 0
              ? `${plural(followUps.length, "company is", "companies are")} waiting on you.`
              : null}
          </div>
        </Section>
      </div>

      <div
        className="aside"
        style={{
          width: 270,
          paddingLeft: 36,
          borderLeft: "1px solid rgb(var(--color-line))",
          marginTop: 6,
        }}
      >
        <div className="xs faint">Companies saved</div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: "-.05em",
            lineHeight: 1,
            margin: "6px 0 4px",
          }}
        >
          {stats.total_companies}
        </div>
        <div className="sm muted">
          {metrics.added > 0
            ? `${metrics.added} added in the last 12 weeks`
            : "Nothing added in the last 12 weeks"}
        </div>
        {insights?.fitting_roles ? (
          <div className="sm muted" style={{ marginTop: 14 }}>
            <b style={{ color: "rgb(var(--color-ink))" }}>{insights.fitting_roles}</b> roles fit
            you.
          </div>
        ) : null}

        <Hair my={26} />
        <div className="xs faint">Authority score</div>
        <div className="row" style={{ alignItems: "flex-end", gap: 12, margin: "6px 0 4px" }}>
          <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-.05em", lineHeight: 1 }}>
            62
          </span>
          <span className="green sm" style={{ paddingBottom: 4 }}>
            +4 this week
          </span>
        </div>
        <Spark pts={[40, 42, 41, 46, 49, 51, 50, 55, 57, 59, 60, 62]} w={200} h={36} />
        <div className="sm muted" style={{ marginTop: 14 }}>
          <b style={{ color: "rgb(var(--color-ink))" }}>Next, +6:</b> publish the ledger project
          README with benchmarks.
        </div>
        <Hair my={26} />
        <div className="xs faint">This week</div>
        <div className="sm" style={{ marginTop: 6 }}>
          <b>3 of 5</b> moves done
        </div>
        <div style={{ marginTop: 8 }}>
          <Bar v={60} tone="teal" />
        </div>
      </div>
    </div>
  );
}
