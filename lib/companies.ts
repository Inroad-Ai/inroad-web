import type { Company } from "@/lib/types";

export const SESSION_EXPIRED = "Your session expired. Sign in again to see your companies.";

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

/** What the user typed ("https://www.acme.com/jobs") as the bare domain the
 * API researches ("acme.com"). */
export function bareDomain(input: string): string {
  const host = input
    .trim()
    .replace(/^[a-z]+:\/\//i, "")
    .split(/[/?#]/)[0];
  return host.replace(/^www\./i, "").toLowerCase() || input;
}
