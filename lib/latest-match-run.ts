import type { PipelineRunStatus } from "@/lib/types";

export interface LatestMatchRun {
  id: string;
  status: PipelineRunStatus;
  startedAt: number;
  error: string | null;
  matchedCompanyIds: string[];
  viewedCompanyIds: string[];
  timedOut: boolean;
}

const STORAGE_KEY = "inroad:research:latest-successful-match";

function isLatestMatchRun(value: unknown): value is LatestMatchRun {
  if (!value || typeof value !== "object") return false;
  const run = value as Partial<LatestMatchRun>;
  return (
    typeof run.id === "string" &&
    run.status === "completed" &&
    typeof run.startedAt === "number" &&
    Array.isArray(run.matchedCompanyIds) &&
    run.matchedCompanyIds.every((id) => typeof id === "string") &&
    Array.isArray(run.viewedCompanyIds) &&
    run.viewedCompanyIds.every((id) => typeof id === "string")
  );
}

export function loadLatestMatchRun(): LatestMatchRun | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const run: unknown = JSON.parse(raw);
    if (
      !isLatestMatchRun(run) ||
      run.matchedCompanyIds.every((id) => run.viewedCompanyIds.includes(id))
    ) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return run;
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveLatestMatchRun(run: LatestMatchRun) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(run));
}

export function clearLatestMatchRun() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}
