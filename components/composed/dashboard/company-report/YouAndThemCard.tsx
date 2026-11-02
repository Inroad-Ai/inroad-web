import type { ReactNode } from "react";

import type { CompanyBrief } from "@/lib/company-brief";
import { formatMonth } from "@/lib/format";
import type { CompanyDetail, RoleTeam, SkillMatch } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { ExternalLink } from "./ExternalLink";

/** What this company means for the person: the role and its team, how their
 * skills meet it, and what to mention when they write. */
export function YouAndThemCard({ detail, brief }: { detail: CompanyDetail; brief: CompanyBrief }) {
  const { why, hooks } = brief;
  const skills = detail.skill_match;
  const team = detail.role_team;
  const columns = [why?.roleTitle, skills, hooks.length > 0 || why?.whyNow].filter(Boolean);
  if (columns.length === 0) return null;

  return (
    <Card
      as="section"
      aria-label="You and this company"
      className={`grid gap-8 ${columns.length >= 3 ? "lg:grid-cols-3" : columns.length === 2 ? "md:grid-cols-2" : ""}`}
    >
      {why?.roleTitle ? (
        <Column title="The role for you" dot>
          {why.roleTitle ? (
            <p className="text-lg font-sans-semibold leading-snug text-ink">
              <ExternalLink href={why.roleUrl}>{why.roleTitle}</ExternalLink>
            </p>
          ) : null}
          {why?.fitReason ? (
            <p className="mt-1 text-sm text-ink-muted">Fits you: {why.fitReason}</p>
          ) : null}
          {team ? <TeamLine team={team} /> : null}
        </Column>
      ) : null}

      {skills ? (
        <Column title="Your skills">
          <SkillSummary skills={skills} />
        </Column>
      ) : null}

      {hooks.length > 0 || why?.whyNow ? (
        <Column title="Things to mention">
          <ul className="flex flex-col gap-3">
            {why?.whyNow ? (
              <li className="text-sm leading-relaxed text-ink">{why.whyNow}</li>
            ) : null}
            {hooks.map((hook) => (
              <li key={hook.text} className="text-sm leading-relaxed text-ink">
                {hook.url ? <ExternalLink href={hook.url}>{hook.text}</ExternalLink> : hook.text}
                {hook.date ? (
                  <span className="ml-2 utility-label text-ink-faint">
                    {formatMonth(hook.date)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </Column>
      ) : null}
    </Card>
  );
}

function Column({ title, dot, children }: { title: string; dot?: boolean; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <Eyebrow as="h2" dot={dot ? "static" : undefined}>
        {title}
      </Eyebrow>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function TeamLine({ team }: { team: RoleTeam }) {
  const parts = [
    team.department ? `${team.department} team` : null,
    team.reports_to ? `reports to ${team.reports_to}` : null,
    team.team_size > 0
      ? `${team.team_size} ${team.team_size === 1 ? "person" : "people"} in this function on their site`
      : null,
  ].filter(Boolean);
  return parts.length > 0 ? <p className="mt-3 text-sm text-ink">{parts.join(" · ")}</p> : null;
}

function SkillSummary({ skills }: { skills: SkillMatch }) {
  const total = skills.matched.length + skills.missing.length;
  const against = skills.basis === "posting" ? "this role asks for" : "their stack uses";
  return (
    <>
      <p className="text-sm text-ink">
        You have <span className="font-sans-semibold">{skills.matched.length}</span> of the {total}{" "}
        {against}.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {skills.matched.map((skill) => (
          <li key={skill}>
            <Badge tone="success">{skill}</Badge>
          </li>
        ))}
        {skills.missing.map((skill) => (
          <li key={skill}>
            <Badge tone="neutral">{skill}</Badge>
          </li>
        ))}
      </ul>
      {skills.missing.length > 0 ? (
        <p className="mt-2 text-xs text-ink-faint">Grey: not on your profile yet.</p>
      ) : null}
    </>
  );
}
