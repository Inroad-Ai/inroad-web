import type { ResearchStep } from "@/lib/api-client/client";

/** What each live step says while it runs, and once done, with its count. */
export const RESEARCH_STEP_COPY: Record<
  ResearchStep,
  { running: string; done: (count: number | null) => string }
> = {
  site: {
    running: "Reading their website",
    done: (n) => (n === null ? "Read their website" : `Read ${n} ${plural(n, "page")}`),
  },
  jobs: {
    running: "Checking their job board",
    done: (n) =>
      n === null
        ? "Job board checked"
        : n
          ? `Found ${n} open ${plural(n, "role")}`
          : "No job board we can read",
  },
  facts: {
    running: "Pulling out facts, each with its source",
    done: (n) => (n === null ? "Facts pulled out" : `${n} ${plural(n, "fact")} with sources`),
  },
  news: {
    running: "Checking for recent news",
    done: (n) =>
      n === null ? "News checked" : n ? `${n} news ${plural(n, "item")}` : "No recent news",
  },
  people: {
    running: "Finding people on their team",
    done: (n) =>
      n ? `${n} ${plural(n, "person", "people")} named` : "No team page listing people",
  },
};

function plural(n: number, one: string, many = `${one}s`): string {
  return n === 1 ? one : many;
}
