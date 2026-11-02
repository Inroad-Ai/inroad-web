"use client";

import { useState } from "react";

import type { CompanyBrief } from "@/lib/company-brief";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { DashboardPanel } from "../DashboardPanel";
import { ExternalLink } from "./ExternalLink";

// Departments named in the folded summary; the rest are counted in "and N more".
const SUMMARY_DEPARTMENTS = 3;

/** The company's other openings. Folded by default when some roles fit the
 * person: those are listed above, these are context. */
export function OpenRolesSection({ brief }: { brief: CompanyBrief }) {
  const { roles, board, careersUrl, momentum } = brief;
  const [expanded, setExpanded] = useState(roles.fitting === 0);
  if (roles.listed === 0 && roles.fitting === 0 && !board && !careersUrl) return null;

  return (
    <DashboardPanel
      title={roles.fitting > 0 ? "Other open roles" : "Open roles"}
      meta={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {momentum ? (
            <Badge tone="teal" dot>
              {momentum.newRoles} new in {momentum.days} days
            </Badge>
          ) : null}
          {board ? (
            <ExternalLink href={board.url}>
              {roles.total > 0 ? `All ${roles.total} on ${board.label}` : board.label}
            </ExternalLink>
          ) : null}
          {careersUrl ? <ExternalLink href={careersUrl}>Careers page</ExternalLink> : null}
        </div>
      }
    >
      {roles.listed === 0 ? (
        <p className="text-sm text-ink-muted">
          {roles.fitting > 0
            ? "Every open role here is in the list that fits you."
            : board
              ? `No open roles are listed on ${board.label} right now.`
              : "Their jobs aren't on a job board we can read yet. Their careers page has them."}
        </p>
      ) : expanded ? (
        <RoleGroups brief={brief} />
      ) : (
        <p className="text-sm text-ink-muted">{summary(brief)}</p>
      )}

      {roles.listed > 0 && roles.fitting > 0 ? (
        <Button
          variant="quiet"
          size="sm"
          className="mt-4"
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? "Hide them" : `Show ${roles.listed} other roles`}
        </Button>
      ) : null}
    </DashboardPanel>
  );
}

function RoleGroups({ brief }: { brief: CompanyBrief }) {
  return (
    <div className="flex flex-col gap-6">
      {brief.roles.groups.map((group) => (
        <div key={group.department || "roles"}>
          {group.department ? <Eyebrow as="h3">{group.department}</Eyebrow> : null}
          <ul className={`divide-y divide-line ${group.department ? "mt-2" : ""}`}>
            {group.roles.map((role) => (
              <li
                key={role.key}
                className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <ExternalLink href={role.url} className="text-sm font-sans-semibold">
                  {role.title}
                </ExternalLink>
                {role.place ? (
                  <span className="text-xs text-ink-muted sm:shrink-0">{role.place}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** "42 other roles, mostly in Sales (12), Finance (5) and Legal (3)." */
function summary(brief: CompanyBrief): string {
  const named = brief.roles.groups.filter((group) => group.department);
  const head = `${brief.roles.listed} other ${brief.roles.listed === 1 ? "role" : "roles"}`;
  if (named.length === 0) return `${head} that don't match your target roles.`;
  const parts = named
    .slice(0, SUMMARY_DEPARTMENTS)
    .map((group) => `${group.department} (${group.roles.length})`);
  const rest = named.length - SUMMARY_DEPARTMENTS;
  const list =
    parts.length === 1
      ? parts[0]
      : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
  return `${head}, mostly in ${list}${rest > 0 ? `, and ${rest} more teams` : ""}.`;
}
