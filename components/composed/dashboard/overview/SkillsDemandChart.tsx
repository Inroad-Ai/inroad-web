import type { SkillDemand } from "@/lib/api-client/client";

import { DashboardPanel } from "../DashboardPanel";
import { CHART_COLOR } from "./chart-theme";
import { ChartEmpty } from "./ChartEmpty";
import { RankedBars } from "./RankedBars";

const LEGEND = [
  { label: "On your profile", color: CHART_COLOR.teal },
  { label: "Not on your profile", color: CHART_COLOR.muted },
];

/** The skills the roles that fit the user ask for most, coloured by whether
 * the profile has them: the gaps worth closing stand out. */
export function SkillsDemandChart({ skills, roles }: { skills: SkillDemand[]; roles: number }) {
  const missing = skills.filter((skill) => !skill.have).slice(0, 3);

  return (
    <DashboardPanel
      title="Skills in demand"
      description={`What the ${roles} ${roles === 1 ? "role that fits" : "roles that fit"} you ask for most.`}
      meta={
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {LEGEND.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5 text-xs text-ink-muted">
              <svg aria-hidden viewBox="0 0 10 10" className="h-2.5 w-2.5">
                <rect width="10" height="10" rx="2" fill={item.color} />
              </svg>
              {item.label}
            </li>
          ))}
        </ul>
      }
    >
      {skills.length === 0 ? (
        <div className="h-chart">
          <ChartEmpty message="Skills show here once your companies have roles that fit you." />
        </div>
      ) : (
        <>
          <RankedBars
            rows={skills.map((skill) => ({
              key: skill.skill,
              label: skill.skill,
              value: skill.roles,
              color: skill.have ? CHART_COLOR.teal : CHART_COLOR.muted,
            }))}
            valueName="Roles asking for it"
            ariaLabel={skills
              .map((s) => `${s.skill}: ${s.roles} roles, ${s.have ? "on" : "not on"} your profile`)
              .join(", ")}
          />
          {missing.length > 0 ? (
            <p className="mt-4 text-sm text-ink-muted">
              Worth adding if you have them:{" "}
              <span className="text-ink">{missing.map((s) => s.skill).join(", ")}</span>.
            </p>
          ) : null}
        </>
      )}
    </DashboardPanel>
  );
}
