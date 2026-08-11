/** Display helpers for dossier values, covering what the API does not send. */

/** 1615 -> "1.62" seconds. */
export function totalTimeSeconds(elapsedMs: number): string {
  return (elapsedMs / 1000).toFixed(2);
}

const SEEN_KEY = "inroad:last-live-fetch";

type SeenMap = Record<string, number>;

function readSeen(): SeenMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? "{}") as SeenMap;
  } catch {
    return {};
  }
}

/**
 * The dossier carries no timestamp, so "cached 12m ago" can only come from
 * here - and only for runs made in this browser.
 */
export function recordLiveFetch(domain: string, at: number = Date.now()): void {
  if (typeof window === "undefined") return;
  const seen = readSeen();
  seen[domain] = at;
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    // Storage full or blocked; the badge just drops the relative time.
  }
}

/** Epoch ms of the last live fetch of this domain in this browser, or null. */
export function lastLiveFetchAt(domain: string): number | null {
  return readSeen()[domain] ?? null;
}

/** 720000 -> "12m ago". Coarse on purpose. */
export function relativeTime(since: number, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - since) / 1000));
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
