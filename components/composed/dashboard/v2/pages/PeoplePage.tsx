import Link from "next/link";
import type { ReactNode } from "react";

import { Av, Btn, Ic, Status, Tag, Views, Warmth } from "../kit";

type Tone = "" | "amber" | "teal" | "violet" | "blue";
type StatusTone = "" | "amber" | "faint" | "rose";
type Row = [
  string,
  number,
  string,
  string,
  string,
  Tone,
  number,
  string,
  string,
  StatusTone,
  string,
];

const ROWS: Row[] = [
  [
    "Priya Nair",
    3,
    "Ledgerline",
    "Head of Platform",
    "Decision maker",
    "amber",
    3,
    "You, Marcus, Priya",
    "Replied",
    "amber",
    "Reply today",
  ],
  [
    "Marcus Webb",
    4,
    "Ledgerline",
    "Staff Engineer",
    "Referrer",
    "teal",
    3,
    "Same repo, Ledgerkit",
    "Waiting",
    "",
    "Ask for a referral",
  ],
  [
    "Dana Lee",
    2,
    "Fieldstone AI",
    "Eng. Manager",
    "Decision maker",
    "amber",
    2,
    "Go Berlin meetup",
    "Found",
    "faint",
    "Warm intro",
  ],
  [
    "Xi Yan",
    6,
    "Stealth fintech",
    "Founder",
    "Founder",
    "violet",
    3,
    "You, Marcus, Xi",
    "Found",
    "faint",
    "Message now",
  ],
  [
    "Tom Berg",
    1,
    "Northwind Labs",
    "VP Engineering",
    "Executive",
    "",
    2,
    "Conference talk",
    "Quiet 6 days",
    "rose",
    "Follow up",
  ],
  [
    "Ana Kowalski",
    5,
    "Ledgerline",
    "Recruiter",
    "Recruiter",
    "blue",
    1,
    "No shared path",
    "Found",
    "faint",
    "Send intro",
  ],
  [
    "Jo Chen",
    5,
    "Quill Health",
    "Recruiter",
    "Recruiter",
    "blue",
    2,
    "Past colleague",
    "Replied",
    "amber",
    "Book a call",
  ],
];

function Th({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span className="ci">
      <Ic n={icon} size="xs" />
      {children}
    </span>
  );
}

export function PeoplePage() {
  return (
    <>
      <div className="row head">
        <div>
          <h1 className="t">People</h1>
          <div className="sub">Everyone worth talking to, with the warmest path in.</div>
        </div>
        <span className="sp" />
        <Btn icon="search" href="/research">
          Find more people
        </Btn>
        <Btn kind="p" icon="plus">
          Add person
        </Btn>
      </div>

      <div style={{ marginTop: 22 }}>
        <Views
          items={[
            { l: "Everyone", n: 86, on: true },
            { l: "Hiring managers", n: 18 },
            { l: "Founders", n: 9 },
            { l: "Recruiters", n: 22 },
            { l: "Maintainers", n: 11 },
            { l: "Warm paths", n: 6 },
            { l: "+ New list" },
          ]}
        />
      </div>
      <div className="row wrap" style={{ gap: 18, margin: "12px 0 4px" }}>
        <span className="sm muted">
          <Ic n="filter" size="xs" /> Filter
        </span>
        <span className="sm muted">Sort: Warmth</span>
        <span className="sp" />
        <span className="sm">
          <b className="amber">2 replies</b>{" "}
          <span className="muted">waiting. 6 warm paths unused.</span>
        </span>
      </div>

      <div className="tablewrap">
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 230 }}>
                <Th icon="user">Person</Th>
              </th>
              <th>
                <Th icon="building">Company</Th>
              </th>
              <th>
                <Th icon="tag">Role</Th>
              </th>
              <th>
                <Th icon="flame">Warmth</Th>
              </th>
              <th>
                <Th icon="users">Best path</Th>
              </th>
              <th>
                <Th icon="flag">Status</Th>
              </th>
              <th>
                <Th icon="arrow">Next</Th>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([name, c, company, title, type, tone, w, path, status, sTone, next]) => (
              <tr key={name}>
                <td>
                  <Link href="/contacts/priya-nair" className="row">
                    <Av
                      i={name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                      c={c}
                      size="xs"
                    />
                    <div>
                      <span className="m">{name}</span> <span className="faint xs">{title}</span>
                    </div>
                  </Link>
                </td>
                <td className="muted">{company}</td>
                <td>
                  <Tag tone={tone}>{type}</Tag>
                </td>
                <td>
                  <Warmth w={w} />
                </td>
                <td className="muted">{path}</td>
                <td>
                  <Status tone={sTone}>{status}</Status>
                </td>
                <td className={sTone === "amber" ? "amber m" : "muted"}>{next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
