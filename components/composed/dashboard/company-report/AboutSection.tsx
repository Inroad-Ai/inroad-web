import type { CompanyBrief } from "@/lib/company-brief";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { DashboardPanel } from "../DashboardPanel";

export function AboutSection({ brief }: { brief: CompanyBrief }) {
  const { about, techStack, leaders } = brief;
  if (about.length === 0 && techStack.length === 0 && leaders.length === 0) return null;

  return (
    <DashboardPanel title="About">
      {about.length > 0 ? (
        <dl className="flex flex-col gap-5">
          {about.map((entry) => (
            <div key={entry.label}>
              <dt>
                <Eyebrow as="span">{entry.label}</Eyebrow>
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink">{entry.text}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {techStack.length > 0 ? (
        <div className={about.length > 0 ? "mt-6" : undefined}>
          <Eyebrow as="h3">Tech stack</Eyebrow>
          <ul className="mt-2 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <li key={tech}>
                <Badge tone="neutral">{tech}</Badge>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {leaders.length > 0 ? (
        <div className={about.length > 0 || techStack.length > 0 ? "mt-6" : undefined}>
          <Eyebrow as="h3">Leadership</Eyebrow>
          <ul className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {leaders.map((leader) => (
              <li key={leader.name} className="text-sm text-ink">
                <span className="font-sans-semibold">{leader.name}</span>
                {leader.title ? <span className="text-ink-muted">, {leader.title}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </DashboardPanel>
  );
}
