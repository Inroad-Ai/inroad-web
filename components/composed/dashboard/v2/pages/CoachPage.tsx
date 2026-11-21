import { Btn, Hair, Ic, Lm, Pill } from "../kit";

const CHOICES: [string, boolean][] = [
  ["Technical depth", true],
  ["Leading a small team", false],
  ["Equity that can matter", true],
  ["Shipping to many users", false],
  ["A mission I believe in", false],
  ["Calm, stable work", false],
];

const CHANGES: [string, string, string][] = [
  ["trend", 'Weighted "engineering correctness" higher', "3 companies moved up"],
  ["eye", "Hid 2 manager-only roles", "You prefer technical depth"],
  ["pen", "Suggested a new headline", "Review it"],
];

export function CoachPage() {
  return (
    <div className="split" style={{ display: "flex", gap: 56, justifyContent: "space-between" }}>
      <div style={{ flex: 1, maxWidth: 700, marginTop: 28 }}>
        <div className="row" style={{ gap: 10 }}>
          <Lm c={3} round>
            <Ic n="spark" size="s" />
          </Lm>
          <span className="sm muted">Question 3 this week · about your goals · 30 seconds</span>
        </div>
        <h1
          style={{
            fontSize: 36,
            lineHeight: 1.18,
            letterSpacing: "-.04em",
            fontWeight: 600,
            margin: "22px 0 12px",
          }}
        >
          What would make your next role a clear win 18 months from now?
        </h1>
        <div className="sub" style={{ marginTop: 0 }}>
          Your answer changes which companies rank first.
        </div>

        <div className="row wrap" style={{ gap: 10, margin: "26px 0 18px" }}>
          {CHOICES.map(([t, on]) => (
            <Pill key={t} on={on}>
              {t}
            </Pill>
          ))}
        </div>

        <div
          className="field"
          style={{
            height: "auto",
            minHeight: 60,
            padding: 16,
            whiteSpace: "normal",
            lineHeight: 1.55,
            color: "rgb(var(--color-ink))",
            alignItems: "flex-start",
            fontSize: 15.5,
          }}
        >
          Own the architecture of something that moves real money, with a team that values
          correctness over speed.
          <span className="sp" />
          <span className="faint">
            <Ic n="mic" />
          </span>
        </div>

        <div className="row wrap" style={{ gap: 14, marginTop: 22 }}>
          <Btn kind="p lg" icon="check">
            Save answer
          </Btn>
          <Btn kind="t">Skip</Btn>
          <Btn kind="t" icon="clock">
            Ask me later
          </Btn>
        </div>
      </div>

      <div
        className="aside"
        style={{
          width: 300,
          paddingLeft: 34,
          borderLeft: "1px solid rgb(var(--color-line))",
          marginTop: 30,
        }}
      >
        <div className="b" style={{ marginBottom: 14 }}>
          What changed from your answers
        </div>
        {CHANGES.map(([icon, head, sub]) => (
          <div
            key={head}
            className="row"
            style={{ alignItems: "flex-start", gap: 12, padding: "10px 0" }}
          >
            <span className="teal" style={{ marginTop: 2 }}>
              <Ic n={icon} size="s" />
            </span>
            <div>
              <div className="sm m">{head}</div>
              <div className="xs faint">{sub}</div>
            </div>
          </div>
        ))}
        <Hair my={20} />
        <div className="xs faint">Your plan</div>
        <div className="sm" style={{ marginTop: 6, lineHeight: 1.6 }}>
          &quot;Become the person teams trust with money-critical systems.&quot;
        </div>
        <div className="row" style={{ gap: 10, marginTop: 16 }}>
          <span className="amber">
            <Ic n="flame" size="s" />
          </span>
          <span className="sm">9 day streak · 18 answered</span>
        </div>
      </div>
    </div>
  );
}
