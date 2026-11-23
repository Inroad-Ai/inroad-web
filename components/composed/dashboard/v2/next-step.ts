import type { Company } from "@/lib/types";
import type { PipelineStage } from "@/components/ui/StatusBadge";

export const NEXT_STEP: Record<PipelineStage, string> = {
  researched: "Reach out",
  contacted: "Follow up",
  responded: "Reply",
  interviewing: "Prepare",
  closed: "Closed",
  rejected: "Rejected",
};

/** Where the next step happens: the person to write to if one is set,
 * otherwise the company page where you pick one. */
export function nextStepHref(company: Company): string {
  if (company.stage === "closed" || company.stage === "rejected") return `/companies/${company.id}`;
  return company.primary_contact_id
    ? `/contacts/${company.primary_contact_id}`
    : `/companies/${company.id}`;
}

export function nextStepHint(company: Company): string {
  if (company.stage === "closed" || company.stage === "rejected") return "Open the company";
  return company.primary_contact_id
    ? "Open the outreach draft for your contact"
    : "Open the company to pick who to contact";
}
