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

const DAY_MS = 86_400_000;
export const QUIET_AFTER_DAYS = 7;

export function daysSince(iso: string): number {
  return Math.floor((Date.now() - Date.parse(iso)) / DAY_MS);
}

/** A contacted company with no movement for a week needs a nudge. */
export function isQuiet(company: Company): boolean {
  return company.stage === "contacted" && daysSince(company.updated_at) >= QUIET_AFTER_DAYS;
}

/** What to do next, in a few words, for a card on the Stages board. */
export function boardNote(company: Company): string {
  if (isQuiet(company)) return `Quiet for ${daysSince(company.updated_at)} days`;
  switch (company.stage) {
    case "researched":
      return company.primary_contact_id ? "Send your first message" : "Find a warm path";
    case "contacted":
      return "Follow up if no reply";
    case "responded":
      return "Reply and book a call";
    case "interviewing":
      return "Prepare for the next round";
    case "closed":
      return "Wrap up the details";
    default:
      return "Closed out";
  }
}
