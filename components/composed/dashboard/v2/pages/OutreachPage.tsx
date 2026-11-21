import type { ReactNode } from "react";

import { Av, Btn, Ic } from "../kit";

const SEQUENCE: ["done" | "now" | "", string, string][] = [
  ["done", "First message", "Sent Nov 12, replied"],
  ["now", "Reply to Priya", "Draft ready"],
  ["", "Connect on LinkedIn", "After she replies"],
  ["", "Follow up", "If quiet for 4 days"],
];

function Mention({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        background: "rgb(var(--color-signal-teal-subtle))",
        color: "rgb(var(--color-signal-teal))",
        borderRadius: 5,
        padding: "1px 6px",
        fontSize: ".92em",
      }}
    >
      {children}
    </span>
  );
}

export function OutreachPage() {
  return (
    <div className="split" style={{ display: "flex", gap: 46 }}>
      <div style={{ flex: 1, maxWidth: 760, minWidth: 0 }}>
        <div className="sm faint" style={{ marginBottom: 8 }}>
          People / Priya Nair
        </div>
        <h1 className="t" style={{ fontSize: 30 }}>
          Reply to Priya
        </h1>

        <div
          className="row wrap"
          style={{
            gap: 12,
            marginTop: 18,
            paddingBottom: 14,
            borderBottom: "1px solid rgb(var(--color-line))",
          }}
        >
          <span className="faint sm" style={{ width: 56 }}>
            To
          </span>
          <span className="row" style={{ gap: 8 }}>
            <Av i="PN" c={3} size="xs" />
            <span>Priya Nair</span>
            <span className="faint">priya@ledgerline.io</span>
          </span>
          <span className="sp" />
          <span className="sm muted">
            Tone: <b style={{ color: "rgb(var(--color-ink))" }}>Peer</b>
          </span>
        </div>
        <div
          className="row"
          style={{ gap: 12, padding: "12px 0", borderBottom: "1px solid rgb(var(--color-line))" }}
        >
          <span className="faint sm" style={{ width: 56 }}>
            Subject
          </span>
          <span className="m">Thursday works. Sharding by cohort and the Ledgerkit benchmarks</span>
        </div>

        <div style={{ fontSize: 16.5, lineHeight: 1.85, marginTop: 22 }}>
          Hi Priya,
          <br />
          <br />
          Thursday works for me, thank you. Your post on{" "}
          <Mention>sharding the ledger by account cohort</Mention> reminded me of the reconciliation
          work I did at Mercato, where we cut month-end close from 6 hours to 40 minutes.
          <br />
          <br />I benchmarked that same pattern in{" "}
          <Mention>Ledgerkit, which Marcus maintains</Mention>. I would love to hear how your audits
          changed the shard boundaries.
          <br />
          <br />
          Would 20 minutes at 10:00 CET suit you?
          <br />
          <br />
          Jordan
        </div>

        <div style={{ marginTop: 34, borderTop: "1px solid rgb(var(--color-line))" }}>
          <div className="row" style={{ padding: "14px 0" }}>
            <span className="faint">
              <Ic n="chev" size="s" />
            </span>
            <span className="m">Why this draft</span>
            <span className="sp" />
            <span className="sm faint">3 sources, 2 left out on purpose</span>
          </div>
        </div>

        <div className="row wrap" style={{ gap: 12, marginTop: 6 }}>
          <Btn kind="p lg" icon="send">
            Send from my Gmail
          </Btn>
          <Btn icon="mail">Save as draft</Btn>
          <Btn kind="t" icon="clock">
            Schedule
          </Btn>
          <span className="sp" />
          <span className="xs faint">Autosaved. Nothing sends without you.</span>
        </div>
      </div>

      <div
        className="aside"
        style={{
          width: 250,
          paddingLeft: 34,
          borderLeft: "1px solid rgb(var(--color-line))",
          marginTop: 6,
        }}
      >
        <div className="xs faint" style={{ marginBottom: 12 }}>
          Sequence
        </div>
        {SEQUENCE.map(([state, title, meta], i) => (
          <div
            key={title}
            className="row"
            style={{ alignItems: "flex-start", gap: 12, padding: "8px 0" }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                flex: "none",
                display: "grid",
                placeItems: "center",
                fontSize: 10.5,
                fontWeight: 700,
                marginTop: 1,
                ...(state === "done"
                  ? { background: "rgb(var(--color-success))", color: "rgb(var(--color-paper))" }
                  : state === "now"
                    ? {
                        background: "rgb(var(--color-signal-amber))",
                        color: "rgb(var(--color-on-amber))",
                      }
                    : { boxShadow: "inset 0 0 0 1px rgb(var(--color-ink-faint))" }),
              }}
            >
              {state === "done" ? <Ic n="check" size="xs" /> : i + 1}
            </span>
            <div>
              <div className={`sm ${state === "now" ? "m" : "muted"}`}>{title}</div>
              <div className="xs faint">{meta}</div>
            </div>
          </div>
        ))}
        <div className="note" style={{ marginTop: 20, fontSize: 13 }}>
          <Ic n="clock" size="s" />
          <span>
            Best time: <b style={{ color: "rgb(var(--color-ink))" }}>Thursday 09:10</b> her time.
          </span>
        </div>
      </div>
    </div>
  );
}
