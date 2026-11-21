import { Section, Status } from "../kit";

const HEALTH: [string, string, string, "" | "ochre"][] = [
  ["Public job boards, 34 sources", "2,350", "All healthy", ""],
  ["Government registers, 3 sources", "4,100", "UK register retried once", "ochre"],
  ["Private and hidden platforms, 14", "902", "All healthy", ""],
];

export function JobSources() {
  return (
    <Section title="Job sources, 52" right="Last sweep 12 min ago" style={{ marginTop: 32 }}>
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
  );
}
