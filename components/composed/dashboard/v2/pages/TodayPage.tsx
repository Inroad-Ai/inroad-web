import Link from "next/link";

import { Bar, Btn, Hair, Ic, Lm, Section, Spark, Status, Tag } from "../kit";

const MOVES = [
  {
    tone: "amber" as const,
    head: "Priya Nair replied",
    sub: 'Ledgerline · "Can we talk Thursday?"',
    time: "2 min",
    btn: <Btn kind="p sm">Draft reply</Btn>,
  },
  {
    tone: "teal" as const,
    head: "Fieldstone AI raised $42M",
    sub: "Series B, hiring 6 backend roles, fits you 88%",
    time: "30 sec",
    btn: <Btn kind="sm">Research</Btn>,
  },
  {
    tone: "rose" as const,
    head: "One question from your coach",
    sub: "What makes your next role a clear win?",
    time: "30 sec",
    btn: (
      <Btn kind="sm" href="/coach">
        Answer
      </Btn>
    ),
  },
];

const OPPS = [
  {
    name: "Fieldstone AI",
    c: 2,
    title: "Staff Backend Engineer",
    meta: "Amsterdam or remote",
    fit: 91,
  },
  {
    name: "Northwind Labs",
    c: 3,
    title: "Platform Engineer (Go)",
    meta: "Dublin, posted 2h ago",
    fit: 88,
  },
  {
    name: "Stealth fintech",
    c: 4,
    title: "Founding Engineer",
    meta: "Lisbon, found in filings",
    fit: 84,
    hidden: true,
  },
];

const STAGES = [
  [18, "Researched"],
  [9, "Contacted"],
  [4, "Replied"],
  [2, "Interviewing"],
] as const;

export function TodayPage() {
  return (
    <div className="split" style={{ display: "flex", gap: 44 }}>
      <div style={{ flex: 1, minWidth: 0, maxWidth: 780 }}>
        <div className="muted sm" style={{ marginBottom: 10 }}>
          Tuesday, 17 November
        </div>
        <h1 className="t" style={{ fontSize: 36 }}>
          Good morning, Jordan.
        </h1>
        <div className="sub">Three things today. Everything else can wait.</div>

        <Section title="Today" style={{ marginTop: 28 }}>
          <div className="list">
            {MOVES.map((m) => (
              <div key={m.head}>
                <Status tone={m.tone} />
                <div style={{ flex: 1 }}>
                  <div className="m" style={{ fontSize: 15 }}>
                    {m.head}
                  </div>
                  <div className="sm muted" style={{ marginTop: 2 }}>
                    {m.sub}
                  </div>
                </div>
                <span className="xs faint">{m.time}</span>
                {m.btn}
              </div>
            ))}
          </div>
        </Section>

        <Section title="New for you" right={<Link href="/opportunities">See all 24</Link>}>
          <div className="list">
            {OPPS.map((o) => (
              <div key={o.title}>
                <Lm i={o.name[0]} c={o.c} />
                <div style={{ flex: 1 }}>
                  <div className="m">{o.title}</div>
                  <div className="xs faint" style={{ marginTop: 1 }}>
                    {o.name} · {o.meta}
                  </div>
                </div>
                {o.hidden ? <Tag tone="amber">Hidden</Tag> : null}
                <span className="green m" style={{ width: 44, textAlign: "right" }}>
                  {o.fit}%
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Your pipeline">
          <div className="row" style={{ gap: 0, alignItems: "flex-end" }}>
            {STAGES.map(([n, label], i) => (
              <div key={label} className="row" style={{ gap: 0, alignItems: "flex-end", flex: 1 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.03em" }}>{n}</div>
                  <div className="xs faint">{label}</div>
                </div>
                {i < STAGES.length - 1 ? (
                  <span className="faint" style={{ padding: "0 6px 14px" }}>
                    <Ic n="chev" size="s" />
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <div className="sm muted" style={{ marginTop: 12 }}>
            Reply rate <b className="green">44%</b>, well above the typical 18%. Three conversations
            have gone quiet for 7 days.
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
        <div className="xs faint">Authority score</div>
        <div className="row" style={{ alignItems: "flex-end", gap: 12, margin: "6px 0 4px" }}>
          <span style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-.05em", lineHeight: 1 }}>
            62
          </span>
          <span className="green sm" style={{ paddingBottom: 7 }}>
            +4 this week
          </span>
        </div>
        <Spark pts={[40, 42, 41, 46, 49, 51, 50, 55, 57, 59, 60, 62]} w={200} h={36} />
        <div className="sm muted" style={{ marginTop: 14 }}>
          <b style={{ color: "rgb(var(--color-ink))" }}>Next, +6:</b> publish the ledger project
          README with benchmarks.
        </div>
        <div style={{ marginTop: 10 }}>
          <Link href="/profile" className="btn t" style={{ padding: 0 }}>
            Do it now <Ic n="arrow" size="xs" />
          </Link>
        </div>
        <Hair my={26} />
        <div className="xs faint">This week</div>
        <div className="sm" style={{ marginTop: 6 }}>
          <b>3 of 5</b> moves done
        </div>
        <div style={{ marginTop: 8 }}>
          <Bar v={60} tone="teal" />
        </div>
        <div className="sm muted" style={{ marginTop: 10 }}>
          <Ic n="flame" size="s" /> 9 day streak
        </div>
      </div>
    </div>
  );
}
