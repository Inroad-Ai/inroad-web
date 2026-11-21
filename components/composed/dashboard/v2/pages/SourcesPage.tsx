import { Bar, Btn, Ic, Lm, Section, Status, Toggle } from "../kit";

type Account = [string, number, string, string, "" | "amber", string, string];

const ACCOUNTS: Account[] = [
  ["mail", 4, "Gmail", "Connected", "", "Send from your inbox, drafts, reply detection", "Manage"],
  [
    "github",
    3,
    "GitHub",
    "Connected",
    "",
    "Authority score, open-source hiring, project ideas",
    "Manage",
  ],
  [
    "linkedin",
    2,
    "LinkedIn",
    "Not connected",
    "amber",
    "Profile strength and warm paths. Public profile only",
    "Connect",
  ],
];

const STEPS: [number, string, string, boolean, number][] = [
  [1, "Public company site", "Free, instant", true, 41],
  [2, "Hunter", "Your key, 1 credit per find", true, 34],
  [3, "Apollo", "Rate limited, paused for now", false, 0],
];

const HEALTH: [string, string, string, "" | "ochre"][] = [
  ["Public job boards, 34 sources", "2,350", "All healthy", ""],
  ["Government registers, 3 sources", "4,100", "UK register retried once", "ochre"],
  ["Private and hidden platforms, 14", "902", "All healthy", ""],
];

export function SourcesPage() {
  return (
    <div style={{ maxWidth: 960 }}>
      <div className="row head">
        <div>
          <h1 className="t">Sources</h1>
          <div className="sub">What Inroad looks at, and which source to trust first.</div>
        </div>
        <span className="sp" />
        <Btn kind="p" icon="plus">
          Add a source
        </Btn>
      </div>

      <Section title="Your accounts" style={{ marginTop: 20 }}>
        <div className="list">
          {ACCOUNTS.map(([icon, c, name, status, tone, note, action]) => (
            <div key={name}>
              <Lm c={c}>
                <Ic n={icon} size="s" />
              </Lm>
              <div style={{ flex: 1 }}>
                <div className="m">{name}</div>
                <div className="xs faint">{note}</div>
              </div>
              {tone === "amber" ? (
                <Status tone="amber">{status}</Status>
              ) : (
                <Status>{status}</Status>
              )}
              <span style={{ marginLeft: 12 }}>
                <Btn kind={tone === "" ? "sm" : "sm p"}>{action}</Btn>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Contact email: order of sources" right="Waterfall">
        <div>
          {STEPS.map(([n, name, meta, on, w]) => (
            <div
              key={name}
              className="row"
              style={{
                padding: "8px 0",
                borderBottom: "1px solid rgb(var(--color-line) / .7)",
                gap: 14,
              }}
            >
              <span className="faint">
                <Ic n="more" size="s" />
              </span>
              <span className="xs faint" style={{ width: 12 }}>
                {n}
              </span>
              <div style={{ flex: 1 }}>
                <div className="m">{name}</div>
                <div className="xs faint">{meta}</div>
              </div>
              <div style={{ width: 80 }}>
                <Bar v={w} tone={on ? "teal" : ""} />
              </div>
              <span className="xs muted" style={{ width: 70, textAlign: "right" }}>
                {on ? `finds ${w}%` : "paused"}
              </span>
              <Toggle on={on} label={name} />
            </div>
          ))}
        </div>
        <div className="row" style={{ gap: 12, marginTop: 12 }}>
          <span className="btn t sm" style={{ padding: 0 }}>
            <Ic n="plus" size="s" /> Add a source
          </span>
          <span className="sp" />
          <span className="sm muted">
            Stops at the first valid email. Together they find{" "}
            <b style={{ color: "rgb(var(--color-ink))" }}>75%</b>.
          </span>
        </div>
      </Section>

      <Section title="Job sources, 52" right="Last sweep 12 min ago">
        <div className="tablewrap">
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 260 }}>Source group</th>
                <th>Records today</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {HEALTH.map(([name, records, health, tone]) => (
                <tr key={name}>
                  <td className="m">{name}</td>
                  <td className="num muted">{records}</td>
                  <td>
                    <Status tone={tone}>{health}</Status>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
