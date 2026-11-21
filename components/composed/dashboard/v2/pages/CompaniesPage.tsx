import Link from "next/link";
import type { ReactNode } from "react";

import { Btn, Ic, Lm, Tag, Views } from "../kit";

type Tone = "" | "amber" | "green" | "teal";
type Row = [string, number, number, string, Tone, string, number, string, boolean?];

const ROWS: Row[] = [
  ["Ledgerline", 1, 91, "Contacted", "amber", "$42M B", 6, "Reply to Priya", true],
  ["Fieldstone AI", 2, 88, "Researched", "", "$18M A", 6, "Find a warm path"],
  ["Northwind Labs", 3, 84, "Responded", "green", "$60M B", 3, "Book intro call"],
  ["Stealth fintech", 4, 84, "Researched", "", "Seed", 1, "Message founder"],
  ["Paperplane", 5, 79, "Researched", "", "$9M A", 2, "Check rate"],
  ["Quill Health", 6, 77, "Interviewing", "teal", "$120M C", 4, "Prep round 2"],
  ["Helio Robotics", 1, 72, "Researched", "", "$30M A", 2, "Re-research"],
];

const SUGGESTED = ["Hiring manager", "Visa sponsor", "Tech overlap"];

const GROUPS: [string, string][] = [
  ["Find", "Funding history, Headcount growth, Tech stack, Open roles"],
  ["People", "Hiring manager, Verified email, Warm path"],
  ["Signals", "Open-source hiring, News, Stealth detection"],
];

function Th({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span className="ci">
      <Ic n={icon} size="xs" />
      {children}
    </span>
  );
}

export function CompaniesPage() {
  return (
    <div style={{ position: "relative" }}>
      <div className="row head">
        <div>
          <h1 className="t">Companies</h1>
          <div className="sub">42 companies you researched or saved.</div>
        </div>
        <span className="sp" />
        <Btn icon="up">Import</Btn>
        <Btn kind="p" icon="plus" href="/research">
          New company
        </Btn>
      </div>

      <div style={{ marginTop: 22 }}>
        <Views
          items={[
            { l: "All", n: 42, on: true },
            { l: "Shortlist", n: 8 },
            { l: "Funded", n: 12 },
            { l: "Hiring now", n: 15 },
            { l: "Stealth", n: 3 },
            { l: "+ New view" },
          ]}
        />
      </div>
      <div className="row" style={{ gap: 18, margin: "12px 0 4px" }}>
        <span className="sm muted">
          <Ic n="filter" size="xs" /> Filter
        </span>
        <span className="sm muted">Sort: Fit</span>
        <span className="sm muted">Group: None</span>
        <span className="sp" />
        <span className="sm faint">7 of 42</span>
      </div>

      <div className="tablewrap">
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 240 }}>
                <Th icon="building">Company</Th>
              </th>
              <th>
                <Th icon="target">Fit</Th>
              </th>
              <th>
                <Th icon="kanban">Stage</Th>
              </th>
              <th>
                <Th icon="dollar">Funding</Th>
              </th>
              <th>
                <Th icon="briefcase">Roles</Th>
              </th>
              <th>
                <Th icon="arrow">Next step</Th>
              </th>
              <th style={{ width: 36 }}>
                <Ic n="plus" size="s" />
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([name, c, fit, stage, tone, funding, roles, next, sel]) => (
              <tr key={name} className={sel ? "sel" : ""}>
                <td>
                  <Link href="/companies/ledgerline" className="row">
                    <Lm i={name[0]} c={c} size="xs" />
                    <span className="m">{name}</span>
                  </Link>
                </td>
                <td className="num">
                  <b className={fit > 85 ? "green" : ""}>{fit}</b>
                </td>
                <td>
                  <Tag tone={tone}>{stage}</Tag>
                </td>
                <td>{funding}</td>
                <td className="num">{roles}</td>
                <td className={sel ? "amber m" : "muted"}>{next}</td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pop addcol" style={{ right: 20, top: 250, width: 420, padding: "18px 20px" }}>
        <div className="row" style={{ marginBottom: 12 }}>
          <b>Add a column</b>
          <span className="sp" />
          <span className="field" style={{ height: 30, width: 150, fontSize: 13 }}>
            <Ic n="search" size="xs" />
            Search
          </span>
        </div>
        <div className="note teal" style={{ marginBottom: 14, display: "block" }}>
          <div className="xs" style={{ opacity: 0.8, marginBottom: 6 }}>
            Suggested for this table
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            {SUGGESTED.map((t) => (
              <Tag key={t} tone="teal" icon="spark">
                {t}
              </Tag>
            ))}
          </div>
        </div>
        {GROUPS.map(([group, items]) => (
          <div
            key={group}
            style={{ padding: "8px 0", borderTop: "1px solid rgb(var(--color-line))" }}
          >
            <div className="xs faint" style={{ marginBottom: 3 }}>
              {group}
            </div>
            <div className="sm">{items}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
