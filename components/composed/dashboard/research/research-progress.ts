import type { ResearchPhase, ResearchSource } from "@/lib/api-client/client";
import type { ResearchRun } from "@/lib/research-runs";
import type { SourceState } from "@/lib/types";

export function phaseLabel(phase: ResearchPhase | null): string {
  switch (phase) {
    case "verified":
      return "Website address accepted. Getting started...";
    case "gathering":
      return "Checking website, news, people and hiring information";
    case "creating_brief":
      return "Putting your research brief together";
    case "saving":
      return "Saving your research brief";
    default:
      return "Starting research";
  }
}

export const RESEARCH_SOURCES: readonly {
  key: ResearchSource;
  label: string;
  description: string;
}[] = [
  { key: "homepage", label: "Website", description: "How the company describes itself." },
  { key: "news", label: "News", description: "Recent moments worth mentioning." },
  { key: "hiring", label: "Hiring", description: "Open roles and where they are posted." },
  { key: "people", label: "People", description: "Who works there, and who to write to." },
];

/** A source the backend hasn't reported on yet is being checked once the
 * gathering phase starts. */
export function sourceState(run: ResearchRun, key: ResearchSource): SourceState {
  const state = run.sources[key];
  return state === "idle" && run.phase === "gathering" ? "pending" : state;
}

export function sourceStatusLabel(state: SourceState): string {
  switch (state) {
    case "done":
      return "Checked";
    case "failed":
      return "Failed";
    case "not_collected":
      return "Not covered";
    case "pending":
      return "Checking";
    default:
      return "Waiting";
  }
}
