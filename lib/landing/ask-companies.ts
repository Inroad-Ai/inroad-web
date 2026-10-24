import { MORE_COMPANIES } from "./ask-companies-more";
import { TOP_FIT_COMPANIES } from "./ask-companies-top";
import type { DemoCompany } from "./ask-types";

/** Sample companies for the landing console, best fit first. */
export const DEMO_COMPANIES: readonly DemoCompany[] = [...TOP_FIT_COMPANIES, ...MORE_COMPANIES];

export function findDemoCompany(question: string): DemoCompany | undefined {
  const q = question.toLowerCase();
  return DEMO_COMPANIES.find((c) => {
    const name = c.name.toLowerCase();
    return q.includes(name.split(" ")[0]) || q.includes(c.domain.split(".")[0]);
  });
}
