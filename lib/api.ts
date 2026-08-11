/**
 * Display helpers for dossier values returned by lib/api-client.
 *
 * These live apart from the client itself because they exist to paper over
 * what the API does not send: it has no timestamps on a dossier, and it
 * reports milliseconds where the UI shows seconds.
 */

/** elapsed_ms -> seconds, the unit the UI shows. 1615 -> "1.62". */
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
 * Remember when this browser last saw a domain fetched live.
 *
 * The dossier carries no timestamp, so "cached 12m ago" cannot come from the
 * response. This is the only source of that number, and it only knows about
 * runs made in this browser.
 */
export function recordLiveFetch(domain: string, at: number = Date.now()): void {
  if (typeof window === "undefined") return;
  const seen = readSeen();
  seen[domain] = at;
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    // Storage full or blocked. The badge drops the relative time and says
    // nothing false.
  }
}

/** Epoch ms of the last live fetch of this domain in this browser, or null. */
export function lastLiveFetchAt(domain: string): number | null {
  return readSeen()[domain] ?? null;
}

/** 720000 -> "12m ago". Coarse on purpose; nothing here needs second precision. */
export function relativeTime(since: number, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - since) / 1000));
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
