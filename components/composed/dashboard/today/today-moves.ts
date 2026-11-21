import type { NextStep } from "@/lib/api-client/client";
import { companyDisplayName } from "@/lib/company-brief";
import { formatRelativeDays } from "@/lib/format";
import type { Company } from "@/lib/types";

export interface TodayMove {
  companyId: string;
  domain: string;
  logoUrl: string | null;
  title: string;
  detail: string;
}

const MAX_MOVES = 3;
const MAX_FROM_NEXT_STEPS = 2;

const STAGE_VERB: Record<string, string> = {
  researched: "Reach out to",
  contacted: "Follow up with",
  responded: "Reply to",
  interviewing: "Prepare for",
};

function nameOf(company: { domain: string; homepage_title?: string | null }): string {
  return companyDisplayName({
    domain: company.domain,
    homepage_title: company.homepage_title ?? null,
  });
}

/** The few things worth doing now: the best next steps first, then whoever
 * has waited longest for a follow-up. Every move comes from real data. */
export function deriveMoves(steps: NextStep[], followUps: Company[]): TodayMove[] {
  const moves: TodayMove[] = [];
  const seen = new Set<string>();

  for (const step of steps) {
    if (moves.length >= MAX_FROM_NEXT_STEPS) break;
    seen.add(step.company_id);
    moves.push({
      companyId: step.company_id,
      domain: step.domain,
      logoUrl: step.logo_url ?? null,
      title: `${STAGE_VERB[step.stage] ?? "Review"} ${nameOf(step)}`,
      detail: [step.role_title, step.fit_reason].filter(Boolean).join(" · "),
    });
  }

  for (const company of followUps) {
    if (moves.length >= MAX_MOVES) break;
    if (seen.has(company.id)) continue;
    seen.add(company.id);
    moves.push({
      companyId: company.id,
      domain: company.domain,
      logoUrl: company.logo_url,
      title: `${STAGE_VERB[company.stage] ?? "Review"} ${nameOf(company)}`,
      detail: `Updated ${formatRelativeDays(company.updated_at)}`,
    });
  }

  return moves;
}
