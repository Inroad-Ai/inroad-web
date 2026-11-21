import { Btn, Ic, Lm, Props, Status, Tag, Views } from "../kit";

type Row = [
  string,
  string,
  number,
  number,
  string,
  "" | "teal" | "amber" | "green",
  string,
  boolean?,
];

const ROWS: Row[] = [
  ["Staff Backend Engineer", "Fieldstone AI", 2, 91, "Private board API", "teal", "2h"],
  ["Platform Engineer (Go)", "Northwind Labs", 3, 88, "Hidden platform", "amber", "4h"],
  ["Founding Engineer", "Stealth fintech", 4, 84, "Stealth filing", "amber", "Today", true],
  ["Contract: payments API migration", "Paperplane", 5, 79, "Upwork", "", "1d"],
  ["Senior Backend Engineer", "Quill Health", 6, 77, "Gov. register", "green", "2d"],
  ["Backend Engineer", "Helio Robotics", 1, 72, "Greenhouse", "", "3d"],
];

const PLAN: [string, string, string][] = [
  ["check", "Research the company", "Done"],
  ["mail", "Message the founder through Marcus", "Draft ready"],
  ["clock", "Follow up in 4 days", "Automatic"],
];

export function OpportunitiesPage() {
  return (
    <>
      <div>
        <h1 className="t">Opportunities</h1>
        <div className="sub">Everything that fits you, from every source, ranked.</div>
      </div>

      <div style={{ marginTop: 22 }}>
        <Views
          items={[
            { l: "All", n: 24, on: true },
            { l: "Jobs", n: 12 },
            { l: "Contracts", n: 5 },
            { l: "Funded", n: 4 },
            { l: "Stealth", n: 3 },
            { l: "Leads", n: 6 },
          ]}
        />
      </div>
      <div className="row" style={{ margin: "14px 0 6px", gap: 18 }}>
        <span className="sm muted">Filter: Fit 80+, Visa</span>
        <span className="sp" />
        <span className="sm faint">142 filtered out. Why?</span>
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
            {ROWS.map(([role, company, c, fit, source, tone, posted, sel]) => (
              <tr key={role} className={sel ? "sel" : ""}>
                <td>
                  <div className="row">
                    <Lm i={company[0]} c={c} size="xs" />
                    <div>
                      <span className="m">{role}</span> <span className="faint xs">{company}</span>
                    </div>
                  </div>
                </td>
                <td className="num green m">{fit}%</td>
                <td>
                  <Tag tone={tone}>{source}</Tag>
                </td>
                <td className="faint">{posted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="peek" aria-label="Founding Engineer, Stealth fintech">
        <div className="row" style={{ marginBottom: 18 }}>
          <span className="faint">
            <Ic n="arrow" size="s" />
          </span>
          <span className="sm faint">Opportunities</span>
          <span className="sp" />
          <span className="faint">
            <Ic n="more" size="s" />
          </span>
          <span className="faint">
            <Ic n="x" size="s" />
          </span>
        </div>
        <div className="row" style={{ gap: 16, marginBottom: 6 }}>
          <Lm i="S" c={4} size="xl" />
          <div>
            <h1 className="t" style={{ fontSize: 25 }}>
              Founding Engineer
            </h1>
            <div className="sm muted" style={{ marginTop: 3 }}>
              Stealth fintech · Lisbon · seed, 6 people
            </div>
          </div>
        </div>
        <div style={{ margin: "24px 0 22px" }}>
          <Props
            rows={[
              [
                "Fit",
                <b key="f" className="green">
                  84%
                </b>,
                "target",
              ],
              [
                "Found via",
                <span key="v" className="row wrap" style={{ gap: 6 }}>
                  <Tag tone="amber">Incorporation filing</Tag>
                  <Tag tone="teal">Founder post</Tag>
                </span>,
                "eye",
              ],
              [
                "Status",
                <Status key="s" tone="amber">
                  Not public yet
                </Status>,
                "flag",
              ],
              ["Warm path", "You, Marcus Webb, the founder", "users"],
              ["Pay", "€90 to 110k plus equity", "dollar"],
            ]}
          />
        </div>
        <div className="hair" />
        <div style={{ marginTop: 20 }}>
          <div className="b" style={{ marginBottom: 10 }}>
            Why you fit
          </div>
          <div className="sm" style={{ lineHeight: 1.7 }}>
            Ledger domain, same as your Mercato work <span className="tag">Filing</span> and
            seniority matches a founding role <span className="tag">Post</span>. The founder wrote
            about the exact problem you solved.
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <div className="b" style={{ marginBottom: 10 }}>
            Your plan
          </div>
          {PLAN.map(([icon, text, meta], k) => (
            <div key={text} className="row" style={{ padding: "7px 0" }}>
              <span className={k === 0 ? "green" : "faint"}>
                <Ic n={icon} size="s" />
              </span>
              <span className="sm" style={{ flex: 1 }}>
                {text}
              </span>
              <span className="xs faint">{meta}</span>
            </div>
          ))}
          <div className="row" style={{ marginTop: 14 }}>
            <Btn kind="p" icon="arrow" end href="/contacts/priya-nair">
              Start outreach plan
            </Btn>
            <Btn kind="t">Save</Btn>
          </div>
        </div>
      </aside>
    </>
  );
}
