import { Section, Toggle } from "../kit";

const NAV: [string, boolean?][] = [
  ["Account"],
  ["Notifications", true],
  ["Search and matching"],
  ["Learning"],
  ["Privacy and data"],
  ["Appearance"],
  ["Plan and usage"],
];

const CATEGORIES: [string, string, boolean, boolean, boolean][] = [
  ["Replies and messages", "When someone answers you", true, true, true],
  ["Follow-ups due", "A message needs a nudge", true, true, false],
  ["Strong matches, 85 and up", "Good fits and hidden roles", true, false, true],
  ["Funding and signals", "Companies you watch", true, true, false],
  ["Coach questions", "Short check-ins", true, false, false],
  ["Data checks", '"Is this correct?" prompts', true, false, false],
];

const CALM: [string, string][] = [
  ["Daily digest", "One email at 08:30 on weekdays, only if something needs you."],
  ["Quiet hours", "No alerts from 20:00 to 08:00 and on weekends."],
  ["Let urgent replies through", "A reply from a decision maker can break through quiet hours."],
];

export function SettingsPage() {
  return (
    <div className="split" style={{ display: "flex", gap: 56, maxWidth: 1080 }}>
      <nav aria-label="Settings" style={{ width: 190, flex: "none" }}>
        {NAV.map(([label, on]) => (
          <div key={label} className={`ni ${on ? "on" : ""}`} style={{ height: 34 }}>
            {label}
          </div>
        ))}
      </nav>

      <div style={{ flex: 1, maxWidth: 760, minWidth: 0 }}>
        <h1 className="t">Notifications</h1>
        <div className="sub">Calm by default. You decide what is allowed to interrupt you.</div>

        <div className="tablewrap" style={{ marginTop: 24 }}>
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 420 }}>Tell me about</th>
                <th style={{ textAlign: "center" }}>In app</th>
                <th style={{ textAlign: "center" }}>Email</th>
                <th style={{ textAlign: "center" }}>Push</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map(([name, hint, a, b, c]) => (
                <tr key={name}>
                  <td>
                    <div className="m">{name}</div>
                    <div className="xs faint" style={{ marginTop: 1 }}>
                      {hint}
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Toggle on={a} label={`${name}, in app`} />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Toggle on={b} label={`${name}, email`} />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Toggle on={c} label={`${name}, push`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Section title="Calm controls" style={{ marginTop: 32 }}>
          <div style={{ marginTop: 6 }}>
            {CALM.map(([title, text]) => (
              <div
                key={title}
                className="row"
                style={{
                  gap: 20,
                  padding: "14px 0",
                  borderBottom: "1px solid rgb(var(--color-line) / .7)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div className="m">{title}</div>
                  <div className="sm muted" style={{ marginTop: 2 }}>
                    {text}
                  </div>
                </div>
                <Toggle on label={title} />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
