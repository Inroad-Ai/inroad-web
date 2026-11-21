import { Btn, Ic } from "../kit";

const GROUPS: { title: string; items: [string, string, string][] }[] = [
  {
    title: "Companies",
    items: [
      [
        "target",
        "Find companies for me",
        "Match companies to your profile, sponsorship and signals.",
      ],
      ["building", "Deep-dive a company", "Site, news, funding, tech, people and open roles."],
      [
        "rocket",
        "Funding and stealth startups",
        "Fresh rounds and filings, before they post a role.",
      ],
    ],
  },
  {
    title: "People",
    items: [
      ["users", "People and decision makers", "Who hires, who refers, and the best way in."],
      ["user", "Research a person", "Background, writing, talks and common ground."],
    ],
  },
  {
    title: "Opportunities",
    items: [
      ["layers", "Boards and hidden roles", "52 sources, public, private and hidden."],
      ["briefcase", "Freelance and contracts", "Upwork and direct clients, with rates."],
      ["zap", "Lead generation", "Clients or leads by region and size."],
    ],
  },
];

const SUGGESTIONS = [
  "Series A to B backend roles in the EU",
  "Companies that hire from open source",
  "Who runs platform at Ledgerline?",
];

export function DiscoverPage() {
  return (
    <div style={{ maxWidth: 1040 }}>
      <h1 className="t">Discover</h1>
      <div className="sub">
        Ask in plain words, or pick what to find. Everything starts from here.
      </div>

      <div className="field lg focus" style={{ marginTop: 26, color: "rgb(var(--color-ink))" }}>
        <Ic n="search" size="l" />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          Funded fintechs in Berlin that sponsor visas and hire backend engineers
        </span>
        <span className="sp" />
        <span className="faint">
          <Ic n="mic" />
        </span>
        <Btn kind="p" icon="arrow" end href="/research/results">
          Research
        </Btn>
      </div>

      <div className="row wrap" style={{ gap: 10, marginTop: 18 }}>
        <span className="sm faint">Suggested for you</span>
        {SUGGESTIONS.map((t) => (
          <span key={t} className="pill" style={{ height: 30, fontSize: 13 }}>
            <Ic n="spark" size="xs" />
            {t}
          </span>
        ))}
      </div>

      <div className="row split" style={{ gap: 56, alignItems: "flex-start", marginTop: 56 }}>
        {GROUPS.map((g) => (
          <div key={g.title} style={{ flex: 1, minWidth: 0 }}>
            <div className="sm faint" style={{ marginBottom: 8 }}>
              {g.title}
            </div>
            {g.items.map(([icon, title, desc]) => (
              <div
                key={title}
                className="row"
                style={{
                  gap: 14,
                  padding: "12px 10px",
                  margin: "0 -10px",
                  borderRadius: 10,
                  alignItems: "flex-start",
                }}
              >
                <span className="muted" style={{ marginTop: 2 }}>
                  <Ic n={icon} />
                </span>
                <div>
                  <div className="m" style={{ fontSize: 15 }}>
                    {title}
                  </div>
                  <div className="sm muted" style={{ marginTop: 2, lineHeight: 1.45 }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        className="row wrap"
        style={{
          gap: 18,
          marginTop: 34,
          paddingTop: 18,
          borderTop: "1px solid rgb(var(--color-line))",
        }}
      >
        <span className="muted sm">Running now</span>
        <span className="st teal sm">
          <i />
          Fieldstone AI, 72%
        </span>
        <span className="st teal sm">
          <i />
          Boards scan, 38%
        </span>
        <span className="sp" />
        <span className="sm muted">Watchlists: 11 new results</span>
      </div>
    </div>
  );
}
