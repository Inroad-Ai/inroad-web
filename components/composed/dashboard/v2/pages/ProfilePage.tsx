"use client";

import { useProfile } from "@/hooks/useProfile";
import type { ReactNode } from "react";

import { Av, Bar, Btn, Ic, Lm, Section, Spark, Tag, Views } from "../kit";

export function ProfileTabs({ tab }: { tab: "details" | "authority" | "projects" }) {
  return (
    <Views
      items={[
        { l: "Profile", on: tab === "details", href: "/profile" },
        { l: "Authority", on: tab === "authority", href: "/profile/authority" },
        { l: "Projects", on: tab === "projects", href: "/profile/projects" },
      ]}
    />
  );
}

function ProfileHead({ tab }: { tab: "authority" | "projects" }) {
  const { profile } = useProfile();
  const name = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const subtitle = profile
    ? [profile.target_roles.join(", "), profile.location].filter(Boolean).join(" · ")
    : "";

  return (
    <>
      <div className="row wrap" style={{ gap: 18 }}>
        <Av i={initials} c={2} size="xl" />
        <div>
          <h1 className="t" style={{ fontSize: 30 }}>
            {name || "Your profile"}
          </h1>
          {subtitle ? (
            <div className="sm muted" style={{ marginTop: 4 }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        <span className="sp" />
        <Btn kind="p" icon="user" href="/profile">
          Edit profile
        </Btn>
      </div>
      <div style={{ marginTop: 22 }}>
        <ProfileTabs tab={tab} />
      </div>
    </>
  );
}

function Part({
  label,
  v,
  note,
  on = true,
}: {
  label: string;
  v: number;
  note: ReactNode;
  on?: boolean;
}) {
  return (
    <div
      className="row"
      style={{ gap: 18, padding: "9px 0", borderBottom: "1px solid rgb(var(--color-line) / .7)" }}
    >
      <span style={{ width: 150 }} className="m">
        {label}
      </span>
      <div style={{ flex: 1 }}>
        {on ? <Bar v={v} tone={v > 65 ? "green" : ""} /> : <div className="bar" />}
      </div>
      <span style={{ width: 34, textAlign: "right" }} className={on ? "m" : "faint"}>
        {on ? v : "-"}
      </span>
      <span className="sm muted" style={{ width: 230 }}>
        {note}
      </span>
    </div>
  );
}

function Lever({ points, title, meta }: { points: number; title: string; meta: string }) {
  return (
    <div>
      <span className="green m" style={{ width: 34 }}>
        +{points}
      </span>
      <div style={{ flex: 1 }}>
        <div className="m">{title}</div>
        <div className="xs faint">{meta}</div>
      </div>
      <Btn kind="t sm">
        Do it <Ic n="arrow" size="xs" />
      </Btn>
    </div>
  );
}

const STRONG = { color: "rgb(var(--color-ink))" } as const;

export function ProfileAuthorityPage() {
  return (
    <div style={{ maxWidth: 1000 }}>
      <ProfileHead tab="authority" />

      <div className="row wrap" style={{ gap: 40, alignItems: "flex-end", margin: "22px 0 0" }}>
        <div>
          <div className="sm faint">Authority score</div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 600,
              letterSpacing: "-.06em",
              lineHeight: 1,
              marginTop: 4,
            }}
          >
            62
          </div>
        </div>
        <div style={{ paddingBottom: 10 }}>
          <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.02em" }}>
            Rising. Top 28% of backend engineers in Europe.
          </div>
          <div className="sm muted" style={{ marginTop: 6, maxWidth: 560 }}>
            Hiring managers at your target companies usually score 70 or more. You are 8 points
            away.
          </div>
        </div>
        <span className="sp" />
        <Spark pts={[40, 42, 41, 46, 49, 51, 50, 55, 57, 59, 60, 62]} w={200} h={50} />
      </div>

      <Section title="What it is made of" right="Refreshed daily" style={{ marginTop: 24 }}>
        <div className="tablewrap">
          <Part label="Google presence" v={48} note="Page 1 shows GitHub and one article" />
          <Part label="LinkedIn" v={71} note="Strong headline, thin Featured" />
          <Part label="GitHub" v={74} note="212 contributions in 90 days" />
          <Part label="Open source" v={58} note="3 merged PRs in notable repos" />
          <Part
            label="Writing and talks"
            v={0}
            on={false}
            note={<span className="amber m">Connect a blog or talk</span>}
          />
        </div>
      </Section>

      <Section title="Biggest levers" right="Do three and reach 77">
        <div className="list">
          <Lever
            points={6}
            title="Publish the ledger project README with benchmarks"
            meta="1 hour, from your own project"
          />
          <Lever
            points={5}
            title="Give a 10-minute talk at Go Berlin"
            meta="1 week, 2 open slots found"
          />
        </div>
      </Section>

      <Section title="What it changes">
        <div className="sm muted" style={{ marginTop: 4, lineHeight: 1.7 }}>
          <b style={STRONG}>At 62</b> you reach engineering managers at Series A and B.{" "}
          <b style={STRONG}>At 70</b> direct founder outreach unlocks. <b style={STRONG}>At 80</b>{" "}
          introductions via maintainers and organisers.
        </div>
      </Section>
    </div>
  );
}

const PROJECTS: [string, number, number, string, string][] = [
  ["Ledgerkit", 1, 92, "+8 add benchmarks", "Open source, 340 stars"],
  ["Pay-reconcile", 3, 61, "+3 add a demo", "Private repo"],
  ["Rate-limiter service", 5, 54, "+2 rewrite in Go", "Side project"],
  ["Resume parser", 4, 38, "+1 low demand", "Course project"],
];

const NEXT: [string, string, string, string, number][] = [
  [
    "Kafka-backed event-sourcing demo",
    "Closes your one gap at Ledgerline, Fieldstone and 41 other targets.",
    "+41%",
    "2 weeks",
    9,
  ],
  [
    "OpenTelemetry Go contribution",
    "Observability appears in 38% of platform roles you target.",
    "+27%",
    "3 weeks",
    6,
  ],
  [
    "Postgres replication talk and repo",
    "Sets you apart for staff-level roles, and doubles as a talk.",
    "+19%",
    "1 month",
    5,
  ],
];

const SKILLS: [string, number, boolean][] = [
  ["Python", 94, true],
  ["Go", 81, true],
  ["Postgres", 77, true],
  ["Kubernetes", 64, false],
  ["Kafka", 52, false],
  ["OpenTelemetry", 38, false],
  ["Rust", 31, false],
];

export function ProfileProjectsPage() {
  return (
    <div style={{ maxWidth: 1040 }}>
      <ProfileHead tab="projects" />

      <Section
        title="Your projects, valued by today's market"
        right="Demand data from 14,200 roles"
        style={{ marginTop: 26 }}
      >
        <div className="tablewrap">
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 260 }}>Project</th>
                <th>Market match</th>
                <th>Authority impact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map(([name, c, match, impact, status]) => (
                <tr key={name}>
                  <td>
                    <div className="row">
                      <Lm i={name[0]} c={c} size="xs" />
                      <span className="m">{name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 10 }}>
                      <span style={{ width: 22 }}>{match}</span>
                      <div style={{ width: 80 }}>
                        <Bar v={match} tone={match > 80 ? "green" : ""} />
                      </div>
                    </div>
                  </td>
                  <td className="muted">{impact}</td>
                  <td className="faint">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="split" style={{ display: "flex", gap: 56 }}>
        <div style={{ flex: 1.2, minWidth: 0 }}>
          <Section title="Build next, ranked for you">
            <div className="list">
              {NEXT.map(([title, why, demand, effort, gain]) => (
                <div key={title}>
                  <div style={{ flex: 1 }}>
                    <div className="m" style={{ fontSize: 15 }}>
                      {title}
                    </div>
                    <div className="sm muted" style={{ marginTop: 2 }}>
                      {why}
                    </div>
                    <div className="row wrap" style={{ gap: 8, marginTop: 8 }}>
                      <Tag tone="green" icon="trend">
                        Demand {demand}
                      </Tag>
                      <Tag icon="clock">{effort}</Tag>
                      <Tag tone="amber">+{gain} authority</Tag>
                    </div>
                  </div>
                  <Btn kind="sm">Plan it</Btn>
                </div>
              ))}
            </div>
          </Section>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Section title="Skills in demand" right="Amber is what you have">
            <div className="row" style={{ gap: 26, alignItems: "flex-end", height: 120 }}>
              {SKILLS.map(([skill, v, have]) => (
                <div key={skill} className="col" style={{ alignItems: "center", gap: 8, flex: 1 }}>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 56,
                      height: v,
                      borderRadius: "5px 5px 2px 2px",
                      background: have
                        ? "rgb(var(--color-signal-amber))"
                        : "rgb(var(--color-ink) / .14)",
                    }}
                  />
                  <span className={`xs ${have ? "" : "faint"}`}>{skill}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
