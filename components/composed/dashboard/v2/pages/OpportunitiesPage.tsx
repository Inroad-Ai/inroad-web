"use client";

import { useEffect, useState } from "react";

import { Btn, Ic, Lm, Props, Status, Tag, Views } from "../kit";

type Kind = "jobs" | "contracts" | "funded" | "stealth" | "leads";
type Tone = "" | "teal" | "amber" | "green";

interface Opportunity {
  id: string;
  role: string;
  company: string;
  c: number;
  fit: number;
  source: string;
  tone: Tone;
  posted: string;
  kind: Kind;
  place: string;
  size: string;
  foundVia: [string, Tone][];
  status: [string, "" | "amber"];
  warm: string;
  pay: string;
  why: string;
  plan: [string, string, string][];
}

const PLAN: [string, string, string][] = [
  ["check", "Research the company", "Done"],
  ["mail", "Message the right person", "Draft ready"],
  ["clock", "Follow up in 4 days", "Automatic"],
];

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "fieldstone",
    role: "Staff Backend Engineer",
    company: "Fieldstone AI",
    c: 2,
    fit: 91,
    source: "Private board API",
    tone: "teal",
    posted: "2h",
    kind: "jobs",
    place: "Amsterdam or remote",
    size: "Series A, 40 people",
    foundVia: [["Private board", "teal"]],
    status: ["Open now", ""],
    warm: "Dana Lee, Engineering Manager",
    pay: "€110 to 135k",
    why: "Event-sourced Python and Go, the same pattern you built at Mercato. The team grew from 4 to 11 in a year.",
    plan: PLAN,
  },
  {
    id: "northwind",
    role: "Platform Engineer (Go)",
    company: "Northwind Labs",
    c: 3,
    fit: 88,
    source: "Hidden platform",
    tone: "amber",
    posted: "4h",
    kind: "jobs",
    place: "Dublin",
    size: "Series B, 120 people",
    foundVia: [["Hidden platform", "amber"]],
    status: ["Open now", ""],
    warm: "Tom Berg, VP Engineering",
    pay: "€100 to 125k",
    why: "Platform team hiring for Go services; your Kubernetes and observability work lines up with their stack.",
    plan: PLAN,
  },
  {
    id: "stealth",
    role: "Founding Engineer",
    company: "Stealth fintech",
    c: 4,
    fit: 84,
    source: "Stealth filing",
    tone: "amber",
    posted: "Today",
    kind: "stealth",
    place: "Lisbon",
    size: "Seed, 6 people",
    foundVia: [
      ["Incorporation filing", "amber"],
      ["Founder post", "teal"],
    ],
    status: ["Not public yet", "amber"],
    warm: "You, Marcus Webb, the founder",
    pay: "€90 to 110k plus equity",
    why: "Ledger domain, same as your Mercato work, and seniority matches a founding role. The founder wrote about the exact problem you solved.",
    plan: [
      ["check", "Research the company", "Done"],
      ["mail", "Message the founder through Marcus", "Draft ready"],
      ["clock", "Follow up in 4 days", "Automatic"],
    ],
  },
  {
    id: "paperplane",
    role: "Contract: payments API migration",
    company: "Paperplane",
    c: 5,
    fit: 79,
    source: "Upwork",
    tone: "",
    posted: "1d",
    kind: "contracts",
    place: "Remote",
    size: "Series A, 25 people",
    foundVia: [["Upwork", ""]],
    status: ["Open now", ""],
    warm: "No shared path",
    pay: "€650 a day, 3 months",
    why: "Fixed-scope migration in Python and Postgres, a close match to your payments work.",
    plan: PLAN,
  },
  {
    id: "quill",
    role: "Senior Backend Engineer",
    company: "Quill Health",
    c: 6,
    fit: 77,
    source: "Gov. register",
    tone: "green",
    posted: "2d",
    kind: "funded",
    place: "Berlin",
    size: "Series C, 300 people",
    foundVia: [["Visa sponsor register", "green"]],
    status: ["Open now", ""],
    warm: "Jo Chen, Recruiter (past colleague)",
    pay: "€95 to 120k",
    why: "Verified Blue Card sponsor, fresh Series C, and the role asks for Python and Postgres.",
    plan: PLAN,
  },
  {
    id: "helio",
    role: "Backend Engineer",
    company: "Helio Robotics",
    c: 1,
    fit: 72,
    source: "Greenhouse",
    tone: "",
    posted: "3d",
    kind: "jobs",
    place: "Munich",
    size: "Series A, 70 people",
    foundVia: [["Greenhouse", ""]],
    status: ["Open now", ""],
    warm: "Xi Yan, Founder",
    pay: "€85 to 105k",
    why: "Robotics backend with Go services. Fewer overlaps with your stack than the others.",
    plan: PLAN,
  },
  {
    id: "orbit",
    role: "Platform lead, introduction",
    company: "Orbit Pay",
    c: 3,
    fit: 80,
    source: "Warm lead",
    tone: "teal",
    posted: "5d",
    kind: "leads",
    place: "London",
    size: "Series B, 90 people",
    foundVia: [["Conference talk", "teal"]],
    status: ["Not a listed role", "amber"],
    warm: "Priya Nair, Head of Platform",
    pay: "Not listed",
    why: "Their head of platform spoke about sharding and cohort design, which you have built before.",
    plan: PLAN,
  },
];

const TABS: { id: "all" | Kind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "jobs", label: "Jobs" },
  { id: "contracts", label: "Contracts" },
  { id: "funded", label: "Funded" },
  { id: "stealth", label: "Stealth" },
  { id: "leads", label: "Leads" },
];

type Sort = "fit" | "newest";

const POSTED_ORDER: Record<string, number> = {
  "2h": 0,
  "4h": 1,
  Today: 2,
  "1d": 3,
  "2d": 4,
  "3d": 5,
  "5d": 6,
};

function toggleIn(set: ReadonlySet<string>, id: string): ReadonlySet<string> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function OpportunitiesPage() {
  const [tab, setTab] = useState<"all" | Kind>("all");
  const [query, setQuery] = useState("");
  const [strongOnly, setStrongOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("fit");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(new Set());
  const [doneSteps, setDoneSteps] = useState<ReadonlySet<string>>(new Set());

  const alive = OPPORTUNITIES.filter((o) => !dismissed.has(o.id));
  const needle = query.trim().toLowerCase();
  const shown = alive
    .filter((o) => tab === "all" || o.kind === tab)
    .filter((o) => !strongOnly || o.fit >= 80)
    .filter(
      (o) =>
        !needle || `${o.role} ${o.company} ${o.source} ${o.place}`.toLowerCase().includes(needle),
    )
    .sort((x, y) =>
      sort === "fit"
        ? y.fit - x.fit
        : (POSTED_ORDER[x.posted] ?? 99) - (POSTED_ORDER[y.posted] ?? 99),
    );
  const hiddenCount = alive.length - shown.length;
  const selected = shown.find((o) => o.id === selectedId) ?? null;
  const selectedIndex = selected ? shown.findIndex((o) => o.id === selected.id) : -1;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedId(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function move(delta: number) {
    const target = shown[selectedIndex + delta];
    if (target) setSelectedId(target.id);
  }

  function dismiss(id: string) {
    const index = shown.findIndex((o) => o.id === id);
    const fallback = shown[index + 1] ?? shown[index - 1] ?? null;
    setDismissed((current) => new Set(current).add(id));
    setSelectedId(fallback ? fallback.id : null);
  }

  return (
    <>
      <div>
        <h1 className="t">Opportunities</h1>
        <div className="sub">Everything that fits you, from every source, ranked.</div>
      </div>

      <div style={{ marginTop: 22 }}>
        <Views
          items={TABS.map((t) => ({
            l: t.label,
            n: t.id === "all" ? alive.length : alive.filter((o) => o.kind === t.id).length,
            on: tab === t.id,
            onSelect: () => {
              setTab(t.id);
              setSelectedId(null);
            },
          }))}
        />
      </div>
      <div className="row wrap" style={{ margin: "14px 0 6px", gap: 14 }}>
        <label className="field" style={{ height: 34, width: 260, maxWidth: "100%" }}>
          <Ic n="search" size="xs" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles, companies, sources"
            aria-label="Search opportunities"
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
        <button
          type="button"
          className={`pill ${strongOnly ? "on" : ""}`}
          style={{ height: 32, fontSize: 13 }}
          aria-pressed={strongOnly}
          onClick={() => setStrongOnly((value) => !value)}
        >
          Fit 80+
        </button>
        <label className="sm muted">
          Sort{" "}
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            aria-label="Sort opportunities"
            style={{
              background: "transparent",
              color: "rgb(var(--color-ink))",
              border: 0,
              font: "inherit",
            }}
          >
            <option value="fit" style={{ color: "initial" }}>
              Best fit
            </option>
            <option value="newest" style={{ color: "initial" }}>
              Newest
            </option>
          </select>
        </label>
        <span className="sp" />
        {dismissed.size > 0 ? (
          <button type="button" className="sm amber" onClick={() => setDismissed(new Set())}>
            Restore {dismissed.size} dismissed
          </button>
        ) : null}
        <span className="sm faint">
          {shown.length} shown{hiddenCount > 0 ? `, ${hiddenCount} filtered out` : ""}
        </span>
      </div>

      <div className="tablewrap">
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 330 }}>Role</th>
              <th>Fit</th>
              <th>Source</th>
              <th>Posted</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((o) => (
              <tr
                key={o.id}
                className={o.id === selectedId ? "sel" : ""}
                tabIndex={0}
                role="button"
                aria-label={`Open ${o.role} at ${o.company}`}
                onClick={() => setSelectedId(o.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedId(o.id);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <div className="row">
                    <Lm i={o.company[0]} c={o.c} size="xs" />
                    <div>
                      <span className="m">{o.role}</span>{" "}
                      <span className="faint xs">{o.company}</span>
                    </div>
                  </div>
                </td>
                <td className="num green m">{o.fit}%</td>
                <td>
                  <Tag tone={o.tone}>{o.source}</Tag>
                </td>
                <td className="faint">{o.posted}</td>
              </tr>
            ))}
            {shown.length === 0 ? (
              <tr>
                <td colSpan={4} className="faint">
                  Nothing matches. Clear the search or the Fit filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selected ? (
        <>
          <button
            type="button"
            aria-label="Close details"
            tabIndex={-1}
            onClick={() => setSelectedId(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 25,
              background: "transparent",
              cursor: "default",
            }}
          />
          <aside className="peek" aria-label={`${selected.role}, ${selected.company}`}>
            <div className="row" style={{ marginBottom: 18 }}>
              <button
                type="button"
                className="faint row"
                style={{ gap: 8 }}
                onClick={() => setSelectedId(null)}
              >
                <Ic n="arrow" size="s" />
                <span className="sm">Opportunities</span>
              </button>
              <span className="sp" />
              <button
                type="button"
                className="faint"
                aria-label="Previous opportunity"
                disabled={selectedIndex <= 0}
                onClick={() => move(-1)}
                style={{ transform: "rotate(-90deg)" }}
              >
                <Ic n="chev" size="s" />
              </button>
              <button
                type="button"
                className="faint"
                aria-label="Next opportunity"
                disabled={selectedIndex >= shown.length - 1}
                onClick={() => move(1)}
                style={{ transform: "rotate(90deg)", marginRight: 8 }}
              >
                <Ic n="chev" size="s" />
              </button>
              <button
                type="button"
                className="faint"
                aria-label="Close"
                onClick={() => setSelectedId(null)}
              >
                <Ic n="x" size="s" />
              </button>
            </div>
            <div className="row" style={{ gap: 16, marginBottom: 6 }}>
              <Lm i={selected.company[0]} c={selected.c} size="xl" />
              <div>
                <h1 className="t" style={{ fontSize: 25 }}>
                  {selected.role}
                </h1>
                <div className="sm muted" style={{ marginTop: 3 }}>
                  {selected.company} · {selected.place} · {selected.size}
                </div>
              </div>
            </div>
            <div style={{ margin: "24px 0 22px" }}>
              <Props
                rows={[
                  [
                    "Fit",
                    <b key="f" className="green">
                      {selected.fit}%
                    </b>,
                    "target",
                  ],
                  [
                    "Found via",
                    <span key="v" className="row wrap" style={{ gap: 6 }}>
                      {selected.foundVia.map(([label, tone]) => (
                        <Tag key={label} tone={tone}>
                          {label}
                        </Tag>
                      ))}
                    </span>,
                    "eye",
                  ],
                  [
                    "Status",
                    <Status key="s" tone={selected.status[1]}>
                      {selected.status[0]}
                    </Status>,
                    "flag",
                  ],
                  ["Warm path", selected.warm, "users"],
                  ["Pay", selected.pay, "dollar"],
                ]}
              />
            </div>
            <div className="hair" />
            <div style={{ marginTop: 20 }}>
              <div className="b" style={{ marginBottom: 10 }}>
                Why you fit
              </div>
              <div className="sm" style={{ lineHeight: 1.7 }}>
                {selected.why}
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <div className="b" style={{ marginBottom: 10 }}>
                Your plan
              </div>
              {selected.plan.map(([icon, text, meta], k) => {
                const key = `${selected.id}:${k}`;
                const done = k === 0 || doneSteps.has(key);
                return (
                  <button
                    key={text}
                    type="button"
                    className="row"
                    style={{ padding: "7px 0", width: "100%" }}
                    aria-pressed={done}
                    disabled={k === 0}
                    onClick={() => setDoneSteps((current) => toggleIn(current, key))}
                  >
                    <span className={done ? "green" : "faint"}>
                      <Ic n={done ? "check" : icon} size="s" />
                    </span>
                    <span
                      className="sm"
                      style={{ flex: 1, textDecoration: done && k > 0 ? "line-through" : "none" }}
                    >
                      {text}
                    </span>
                    <span className="xs faint">{done && k > 0 ? "Done" : meta}</span>
                  </button>
                );
              })}
              <div className="row" style={{ marginTop: 14 }}>
                <Btn kind="p" icon="arrow" end href="/contacts">
                  Start outreach plan
                </Btn>
                <Btn kind="t" onClick={() => setSaved((current) => toggleIn(current, selected.id))}>
                  {saved.has(selected.id) ? "Saved" : "Save"}
                </Btn>
                <Btn kind="t" onClick={() => dismiss(selected.id)}>
                  Not interested
                </Btn>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
