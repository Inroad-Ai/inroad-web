import type { Company } from "@/lib/types";

export const SESSION_EXPIRED = "Your session expired. Sign in again to see your companies.";

/** Research runs are still on the Supabase-backed stack, which a native-auth
 * account cannot reach. The company row itself reads fine; only its research
 * trail and the "run research again" action are unavailable. */
export const RESEARCH_UNAVAILABLE =
  "Research history is unavailable while research runs are being migrated. The company details below are current.";

/** Unknown must never collapse into "0 open roles"; they mean different things. */
export function describeHiring(company: Company): { label: string; muted: boolean } {
  if (company.open_roles === null) {
    return { label: "Hiring status unknown", muted: true };
  }
  if (company.open_roles === 0) {
    return { label: "Not currently hiring", muted: true };
  }
  const noun = company.open_roles === 1 ? "role" : "roles";
  return { label: `${company.open_roles} open ${noun}`, muted: false };
}
