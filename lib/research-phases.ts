import type { ResearchPhase } from "@/lib/api-client/client";

/** In order. `null` is the moment before the backend's first phase event. */
const PHASES: readonly (ResearchPhase | null)[] = [
  null,
  "verified",
  "gathering",
  "creating_brief",
  "saving",
];

export const PHASE_COUNT = PHASES.length;

export function phaseIndex(phase: ResearchPhase | null): number {
  return PHASES.indexOf(phase);
}
