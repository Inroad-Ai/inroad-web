import type { CompanyBrief } from "@/lib/company-brief";
import { formatMonth } from "@/lib/format";
import type { CompanyDetail, RoleTeam, SkillMatch } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

import { Section } from "../v2/kit";
import { ExternalLink } from "./ExternalLink";

/** What this company means for the person: the role and its team, how their
 * skills meet it, and what to mention when they write. */
export function YouAndThemCard({ detail, brief }: { detail: CompanyDetail; brief: CompanyBrief }) {
  const { why, hooks } = brief;
  const skills = detail.skill_match;
  const team = detail.role_team;
  if (!why?.roleTitle && !skills && hooks.length === 0 && !why?.whyNow) return null;

  return (
    <Section title="Why it fits you">
      <div style={{ fontSize: 15.5, lineHeight: 1.8 }}>
        {why?.roleTitle ? (
          <p style={{ marginBottom: 10 }}>
            The role for you is{" "}
            <b>
              <ExternalLink href={why.roleUrl}>{why.roleTitle}</ExternalLink>
            </b>
            {why.fitReason ? `. Fits you: ${why.fitReason}` : ""}.
            {team ? <TeamLine team={team} /> : null}
          </p>
        ) : null}
        {skills ? (
          <div style={{ marginBottom: 10 }}>
            <SkillSummary skills={skills} />
          </div>
        ) : null}
        {why?.whyNow ? <p style={{ marginBottom: 10 }}>{why.whyNow}</p> : null}
        {hooks.map((hook) => (
          <p key={hook.text} style={{ marginBottom: 10 }}>
            {hook.text}
            {hook.url ? (
              <span className="tag" style={{ margin: "0 3px", verticalAlign: 1 }}>
                <ExternalLink href={hook.url}>Source</ExternalLink>
              </span>
            ) : null}
            {hook.date ? <span className="faint sm"> {formatMonth(hook.date)}</span> : null}
          </p>
        ))}
      </div>
    </Section>
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
  return parts.length > 0 ? <span className="muted sm"> {parts.join(" · ")}</span> : null;
}

function SkillSummary({ skills }: { skills: SkillMatch }) {
  const total = skills.matched.length + skills.missing.length;
  const against =
    skills.basis === "company"
      ? "their stack uses"
      : skills.role_title
        ? `${skills.role_title} asks for`
        : "this role asks for";
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
