"use client";

import type { ReactNode } from "react";

import { useState } from "react";

import { Bar, Btn, Ic, Lm, Toggle, Views } from "../kit";

type Row = [string, number, number, string, number, string, string, string, boolean?];

const ROWS: Row[] = [
  ["Ledgerline", 1, 91, "$42M B", 6, "Blue Card", "priya@ledgerline.io", "Hunter", true],
  ["Fieldstone AI", 2, 88, "$18M A", 6, "Blue Card", "dana@fieldstone.ai", "Public site"],
  ["Northwind Labs", 3, 84, "$60M B", 3, "IND register", "tom@northwind.com", "Apollo"],
  ["Stealth fintech", 4, 84, "Seed", 1, "-", "Not found", ""],
  ["Paperplane", 5, 79, "$9M A", 2, "Blue Card", "lara@paperplane.dev", "Hunter"],
  ["Quill Health", 6, 77, "$120M C", 4, "Blue Card", "jo@quillhealth.com", "Public site"],
  ["Helio Robotics", 1, 72, "$30M A", 2, "Unknown", "xi@helio.ai", "Apollo"],
];

const WATERFALL: [string, string, string, boolean][] = [
  ["1", "Public company site", "Finds 41%", true],
  ["2", "Hunter", "Finds 34%", true],
  ["3", "Apollo", "Rate limited", false],
];

function Th({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span className="ci">
      <Ic n={icon} size="xs" />
      {children}
    </span>
  );
}

export function DiscoverResultsPage() {
  const [view, setView] = useState("Table");
  const [phase, setPhase] = useState<"preview" | "running" | "done">("preview");
  const [watching, setWatching] = useState(false);
  const [showSource, setShowSource] = useState(true);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(WATERFALL.map(([, name, , on]) => [name, on])),
  );

  function runAll() {
    setPhase("running");
    setTimeout(() => setPhase("done"), 1400);
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="row head">
        <div>
          <h1 className="t">214 companies</h1>
          <div className="sub">Funded fintechs in the EU with visa support. Finished 14:03.</div>
        </div>
        <span className="sp" />
        <Btn icon="bell" onClick={() => setWatching((on) => !on)}>
          {watching ? "Watching" : "Save as watchlist"}
        </Btn>
        <Btn kind="p" icon="send" href="/contacts">
          Reach out
        </Btn>
      </div>

      <div
        className={`note ${phase === "done" ? "teal" : "amber"}`}
        style={{ margin: "20px 0", alignItems: "center" }}
      >
        <Ic n={phase === "done" ? "check" : "eye"} size="s" />
        <span style={{ flex: 1 }}>
          {phase === "done" ? (
            <>
              <b>Done.</b> The email column ran on all 214 companies.
            </>
          ) : phase === "running" ? (
            <>
              <b>Running.</b> Looking up emails for the other 209 companies...
            </>
          ) : (
            <>
              <b>Preview.</b> The email column ran on 5 sample rows only. Check it, then run on all
              214.
            </>
          )}
        </span>
        {phase === "preview" ? (
          <>
            <Btn kind="p sm" onClick={runAll}>
              Run on all 214
            </Btn>
            <Btn kind="t sm" onClick={() => setShowSource(true)}>
              Edit column
            </Btn>
          </>
        ) : null}
      </div>

      <div className="row" style={{ gap: 0 }}>
        <Views
          className="grow"
          items={[
            ["Table", "layers"],
            ["Board", "kanban"],
            ["Gallery", "grid"],
            ["Map", "mapp"],
          ].map(([l, icon]) => ({ l, icon, on: view === l, onSelect: () => setView(l) }))}
        />
        <span className="sm muted" style={{ padding: "0 14px" }}>
          Filter
        </span>
        <span className="sm muted" style={{ padding: "0 14px" }}>
          Sort
        </span>
        <span className="muted">
          <Ic n="search" size="s" />
        </span>
      </div>

      {view !== "Table" ? (
        <p className="sm muted" style={{ padding: "18px 0" }}>
          The {view.toLowerCase()} view of these results is a preview. Switch back to Table.
        </p>
      ) : null}

      <div className="tablewrap" hidden={view !== "Table"}>
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 230 }}>
                <Th icon="building">Company</Th>
              </th>
              <th>
                <Th icon="target">Fit</Th>
              </th>
              <th>
                <Th icon="dollar">Funding</Th>
              </th>
              <th>
                <Th icon="briefcase">Open roles</Th>
              </th>
              <th>
                <Th icon="shield">Visa</Th>
              </th>
              <th>
                <Th icon="mail">Contact email</Th>{" "}
                <span className="amber">
                  <Ic n="layers" size="xs" />
                </span>
              </th>
              <th style={{ width: 40 }}>
                <Ic n="plus" size="s" />
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([name, c, fit, funding, roles, visa, email, source, sel]) => (
              <tr key={name} className={sel ? "sel" : ""}>
                <td>
                  <div className="row">
                    <Lm i={name[0]} c={c} size="xs" />
                    <span className="m">{name}</span>
                  </div>
                </td>
                <td className="num">
                  <div className="row" style={{ gap: 10 }}>
                    <span style={{ width: 22 }}>{fit}</span>
                    <div style={{ width: 60 }}>
                      <Bar v={fit} tone={fit > 85 ? "green" : ""} />
                    </div>
                  </div>
                </td>
                <td>{funding}</td>
                <td className="num">{roles}</td>
                <td>
                  {visa === "-" || visa === "Unknown" ? (
                    <span className="faint">{visa}</span>
                  ) : (
                    <>
                      <span className="green">
                        <Ic n="check" size="xs" />
                      </span>{" "}
                      {visa}
                    </>
                  )}
                </td>
                <td>
                  {email === "Not found" ? (
                    <span className="faint">{email}</span>
                  ) : (
                    <>
                      {email}{" "}
                      {showSource && source ? <span className="faint xs"> · {source}</span> : null}
                    </>
                  )}
                </td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="pop waterfall"
        style={{ right: 40, top: 330, width: 330, padding: "16px 18px" }}
      >
        <div className="row" style={{ marginBottom: 4 }}>
          <b>Contact email</b>
          <span className="sp" />
          <span className="xs faint">Waterfall</span>
        </div>
        <div className="xs muted" style={{ marginBottom: 12 }}>
          Try each source in order. Stop at the first valid email.
        </div>
        {WATERFALL.map(([n, source, meta, on]) => (
          <div
            key={n}
            className="row"
            style={{ padding: "8px 0", borderTop: "1px solid rgb(var(--color-line))" }}
          >
            <span className="xs faint" style={{ width: 14 }}>
              {n}
            </span>
            <div style={{ flex: 1 }}>
              <div className="sm m">{source}</div>
              <div className="xs faint">{meta}</div>
            </div>
            <Toggle
              on={enabled[source]}
              label={source}
              onChange={(next) => setEnabled((c) => ({ ...c, [source]: next }))}
            />
          </div>
        ))}
        <div
          className="row"
          style={{ padding: "10px 0 0", borderTop: "1px solid rgb(var(--color-line))" }}
        >
          <span className="sm" style={{ flex: 1 }}>
            Show the source that found it
          </span>
          <Toggle on={showSource} label="Show the source that found it" onChange={setShowSource} />
        </div>
      </div>
    </div>
  );
}
