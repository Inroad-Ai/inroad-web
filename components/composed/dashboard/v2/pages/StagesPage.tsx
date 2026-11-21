import type { ReactNode } from "react";

import { Btn, Lm, Views } from "../kit";

type CardData = [string, number, number, string, boolean?];

function Card({ data }: { data: CardData }) {
  const [name, c, fit, next, flag] = data;
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 10,
        background: "rgb(var(--color-surface))",
        boxShadow: "inset 0 0 0 1px rgb(var(--color-line))",
      }}
    >
      <div className="row">
        <Lm i={name[0]} c={c} size="xs" />
        <span className="m sm" style={{ flex: 1 }}>
          {name}
        </span>
        <span className={`xs m ${fit > 85 ? "green" : "faint"}`}>{fit}</span>
      </div>
      <div className={`xs ${flag ? "rose" : "muted"}`} style={{ marginTop: 7 }}>
        {flag ? (
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgb(var(--color-muted-rose))",
              marginRight: 6,
            }}
          />
        ) : null}
        {next}
      </div>
    </div>
  );
}

function Column({
  title,
  count,
  dot,
  children,
}: {
  title: string;
  count: number;
  dot: string;
  children?: ReactNode;
}) {
  return (
    <div className="stage-col">
      <div className="row" style={{ marginBottom: 12, padding: "0 2px" }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: `rgb(var(--color-${dot}))`,
          }}
        />
        <span className="m sm">{title}</span>
        <span className="faint sm">{count}</span>
      </div>
      <div className="col" style={{ gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

export function StagesPage() {
  return (
    <>
      <div className="row head">
        <div>
          <h1 className="t">Stages</h1>
          <div className="sub">Drag a card to move it. Each card shows what to do next.</div>
        </div>
        <span className="sp" />
        <Btn kind="p" icon="plus" href="/research">
          Add company
        </Btn>
      </div>

      <div className="sm" style={{ marginTop: 18, color: "rgb(var(--color-ink-muted))" }}>
        <b className="green">44% reply rate</b> and 3.1 days to reply.{" "}
        <span className="rose">Three conversations have been quiet for over 7 days.</span>{" "}
        <span className="amber m">Nudge them</span>
      </div>

      <div style={{ margin: "22px 0 26px" }}>
        <Views
          items={[
            { l: "Board", icon: "kanban", on: true },
            { l: "Table", icon: "layers" },
            { l: "Timeline", icon: "cal" },
          ]}
        />
      </div>

      <div className="stage-board">
        <Column title="Researched" count={18} dot="ink-faint">
          <Card data={["Fieldstone AI", 2, 88, "Find a warm path"]} />
          <Card data={["Stealth fintech", 4, 84, "Message the founder"]} />
          <Card data={["Paperplane", 5, 79, "Check contract rate"]} />
          <div className="xs faint" style={{ padding: "4px 2px" }}>
            15 more
          </div>
        </Column>
        <Column title="Contacted" count={9} dot="signal-teal">
          <Card data={["Ledgerline", 1, 91, "Reply to Priya, due today"]} />
          <Card data={["Helio Robotics", 1, 72, "Quiet for 9 days", true]} />
          <Card data={["Orbit Pay", 3, 80, "Follow up Thursday"]} />
        </Column>
        <Column title="Replied" count={4} dot="signal-amber">
          <Card data={["Northwind Labs", 3, 84, "Book an intro call"]} />
          <Card data={["Mosaic", 2, 81, "Send your portfolio"]} />
        </Column>
        <Column title="Interviewing" count={2} dot="success">
          <Card data={["Quill Health", 6, 77, "Round 2, Monday 10:00"]} />
        </Column>
        <Column title="Offer" count={0} dot="warning">
          <div className="sm faint" style={{ lineHeight: 1.6, padding: "6px 2px" }}>
            Your first offer lands here. Two interviews are open.
          </div>
        </Column>
      </div>
    </>
  );
}
