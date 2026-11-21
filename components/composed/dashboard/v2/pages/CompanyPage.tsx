import type { ReactNode } from "react";

import { Av, Btn, Ic, Lm, Props, Section, Status, Tag, Warmth } from "../kit";

const PEOPLE: [string, number, string, number, string, string][] = [
  ["Priya Nair", 3, "Head of Platform", 3, "priya@ledgerline.io", "Hunter"],
  ["Marcus Webb", 4, "Staff Engineer", 3, "marcus@ledgerline.io", "Public site"],
  ["Ana Kowalski", 5, "Recruiter", 1, "ana@ledgerline.io", "Hunter"],
];

const MORE: [string, string, boolean?][] = [
  ["Funding and growth", "$42M Series B", true],
  ["Open roles", "8 open, 6 fit you"],
  ["Visa and location", "Blue Card sponsor, Berlin"],
  ["Tech and open source", "92% overlap"],
  ["Signals", "3 this month"],
];

function Source({ children }: { children: ReactNode }) {
  return (
    <span className="tag" style={{ margin: "0 3px", verticalAlign: 1 }}>
      <Ic n="link" size="xs" />
      {children}
    </span>
  );
}

export function CompanyPage() {
  return (
    <div style={{ maxWidth: 820 }}>
      <div className="row wrap" style={{ gap: 16 }}>
        <Lm i="L" c={1} size="xl" />
        <div>
          <h1 className="t" style={{ fontSize: 34 }}>
            Ledgerline
          </h1>
          <div className="sm muted" style={{ marginTop: 3 }}>
            ledgerline.io
          </div>
        </div>
        <span className="sp" />
        <Btn kind="t" icon="history">
          Re-research
        </Btn>
        <Btn kind="p" icon="send" href="/contacts/priya-nair">
          Reach out
        </Btn>
      </div>

      <div style={{ margin: "26px 0 8px" }}>
        <Props
          rows={[
            [
              "Fit",
              <span key="f">
                <b className="green">91%</b> <span className="faint">4 of 4 core signals</span>
              </span>,
              "target",
            ],
            [
              "Stage",
              <Tag key="s" tone="amber">
                Contacted
              </Tag>,
              "kanban",
            ],
            ["Funding", "Series B, $42M", "dollar"],
            [
              "Visa",
              <span key="v">
                <Status>Sponsors, verified</Status>{" "}
                <span className="faint xs">Bundesagentur register</span>
              </span>,
              "shield",
            ],
            [
              "Next step",
              <span key="n" className="amber m">
                Reply to Priya, due today
              </span>,
              "arrow",
            ],
          ]}
        />
      </div>

      <Section title="Why it fits you" style={{ marginTop: 30 }}>
        <div style={{ fontSize: 15.5, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 10 }}>
            Their ledger is event-sourced Python and Go, the same pattern you built at Mercato.
            <Source>Engineering blog</Source>
          </p>
          <p style={{ marginBottom: 10 }}>
            The platform team grew from 4 to 11 in a year, with 6 backend roles open now.
            <Source>Greenhouse</Source>
          </p>
          <p>
            Three recent hires first contributed to their open-source SDK.
            <Source>GitHub</Source> <span className="faint sm">medium confidence</span>
          </p>
        </div>
      </Section>

      <Section title="People">
        <div className="tablewrap">
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 230 }}>Name</th>
                <th>Role</th>
                <th>Warmth</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {PEOPLE.map(([name, c, role, w, email, source]) => (
                <tr key={name}>
                  <td>
                    <div className="row">
                      <Av
                        i={name
                          .split(" ")
                          .map((x) => x[0])
                          .join("")}
                        c={c}
                        size="xs"
                      />
                      <span className="m">{name}</span>
                    </div>
                  </td>
                  <td className="muted">{role}</td>
                  <td>
                    <Warmth w={w} width={12} />
                  </td>
                  <td>
                    {email} <span className="faint xs">· {source}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="More">
        <div style={{ marginTop: 6 }}>
          {MORE.map(([title, meta, open]) => (
            <div
              key={title}
              style={{ padding: "11px 0", borderTop: "1px solid rgb(var(--color-line))" }}
            >
              <div className="row">
                <span className="faint" style={{ transform: open ? "rotate(90deg)" : "none" }}>
                  <Ic n="chev" size="s" />
                </span>
                <span className="m">{title}</span>
                <span className="sp" />
                <span className="sm faint">{meta}</span>
              </div>
              {open ? (
                <div className="sm muted" style={{ margin: "8px 0 2px 25px", lineHeight: 1.7 }}>
                  Series B, $42M, September 2026. Led by Northgate Ventures, with Base Capital.
                  Headcount up 38% in 12 months.
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
