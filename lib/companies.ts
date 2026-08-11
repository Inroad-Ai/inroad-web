/** Display helpers shared by every view of a saved company. */

import type { Company } from "@/lib/types";

/**
 * "Unknown" (the fetcher couldn't determine a count) must never collapse
 * into "0 open roles" - they mean different things. Lives here rather than
 * in one component so the table and the pipeline board word it identically.
 */
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
