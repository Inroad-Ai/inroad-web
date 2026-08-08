/**
 * Typed wrapper around the FastAPI backend. `fetch` only — no axios, no
 * react-query, nothing else added.
 */

import type { CompanyDossier } from "./types";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

/** Thrown for transport failures and 4xx/5xx. A partial dossier is a 200 and never lands here. */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    // A dead backend and a CORS rejection are indistinguishable from here, so
    // the message names both rather than guessing.
    throw new ApiError(
      "Could not reach the research service. Check that it is running and that this origin is allowed.",
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(await describeFailure(response), response.status);
  }

  return (await response.json()) as T;
}

/** Pull FastAPI's `detail` out of an error body, falling back to the status. */
async function describeFailure(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: unknown };
    if (typeof body.detail === "string") return body.detail;
  } catch {
    // Not JSON, or an empty body. The status line below is enough.
  }

  if (response.status === 422) return "That does not look like a usable domain.";
  return `The research service returned ${response.status}.`;
}

/**
 * Run research on one domain.
 *
 * Always resolves to a dossier when the service answers, including a partial
 * one — `partial` and `errors` describe what is missing. Only malformed input
 * and transport problems reject.
 */
export function fetchResearch(
  domain: string,
  signal?: AbortSignal,
): Promise<CompanyDossier> {
  return get<CompanyDossier>(
    `/api/research?domain=${encodeURIComponent(domain.trim())}`,
    signal,
  );
}

/** Recent runs, newest first. Server-side memory, so it empties on backend restart. */
export function fetchHistory(signal?: AbortSignal): Promise<CompanyDossier[]> {
  return get<CompanyDossier[]>("/api/research/history", signal);
}

/* ------------------------------------------------------------------ *
 * Display helpers for API values.
 *
 * These live next to the client because they exist to paper over what the
 * API does not send: it has no timestamps on a dossier, and it reports
 * milliseconds where the UI shows seconds.
 * ------------------------------------------------------------------ */

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
