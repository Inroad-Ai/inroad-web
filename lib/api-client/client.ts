/**
 * Typed wrapper around the FastAPI backend, built on `schema.d.ts`
 * (generated) and openapi-fetch. This replaces hand-written `fetch()` calls
 * for anything the backend serves - see README.md in this folder to
 * regenerate the schema after a backend change.
 */

import createClient from "openapi-fetch";

import type { CompanyDossier, CompanyListResponse, CompanySort, OverviewStats } from "@/lib/types";
import type { PipelineStage } from "@/components/ui/StatusBadge";
import type { paths } from "./schema";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

const client = createClient<paths>({ baseUrl: BASE_URL });

/** Thrown for transport failures and 4xx/5xx. A partial dossier is a 200 and never lands here. */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Pull FastAPI's `detail` out of an error body, falling back to the status. */
function describeFailure(status: number, body: unknown): string {
  if (body && typeof body === "object" && typeof (body as { detail?: unknown }).detail === "string") {
    return (body as { detail: string }).detail;
  }
  if (status === 422) return "That does not look like a usable domain.";
  return `The research service returned ${status}.`;
}

/**
 * Run research on one domain.
 *
 * Always resolves to a dossier when the service answers, including a partial
 * one - `partial` and `errors` describe what is missing. Only malformed input
 * and transport problems reject.
 */
export async function fetchResearch(
  domain: string,
  signal?: AbortSignal,
): Promise<CompanyDossier> {
  const { data, error, response } = await client.GET("/api/research", {
    params: { query: { domain: domain.trim() } },
    signal,
  });

  if (error !== undefined) {
    throw new ApiError(describeFailure(response.status, error), response.status);
  }
  if (data === undefined) {
    throw new ApiError("Could not reach the research service. Check that it is running and that this origin is allowed.", 0);
  }

  return data as CompanyDossier;
}

/** Recent runs, newest first. Server-side memory, so it empties on backend restart. */
export async function fetchHistory(signal?: AbortSignal): Promise<CompanyDossier[]> {
  const { data, response } = await client.GET("/api/research/history", { signal });

  if (data === undefined) {
    throw new ApiError(`The research service returned ${response.status}.`, response.status);
  }

  return data as CompanyDossier[];
}

export interface FetchCompaniesParams {
  search?: string;
  stage?: PipelineStage;
  sort?: CompanySort;
  page?: number;
  pageSize?: number;
}

/**
 * One page of the caller's saved companies. Requires a Supabase access
 * token: the backend forwards it to Postgres as-is, so RLS is what actually
 * scopes the rows returned, not anything this function does.
 */
export async function fetchCompanies(
  params: FetchCompaniesParams,
  accessToken: string,
  signal?: AbortSignal,
): Promise<CompanyListResponse> {
  const { data, error, response } = await client.GET("/api/companies", {
    params: {
      query: {
        search: params.search || undefined,
        stage: params.stage,
        sort: params.sort,
        page: params.page,
        page_size: params.pageSize,
      },
    },
    headers: { Authorization: `Bearer ${accessToken}` },
    signal,
  });

  if (error !== undefined) {
    throw new ApiError(describeFailure(response.status, error), response.status);
  }
  if (data === undefined) {
    throw new ApiError("Could not reach the companies service. Check that it is running and that this origin is allowed.", 0);
  }

  return data as CompanyListResponse;
}

/**
 * Aggregate stage counts, contacted-window counts, and the weekly
 * companies-added trend for the Overview page. Same auth shape as
 * fetchCompanies: RLS via the caller's own access token, not this function.
 */
export async function fetchOverviewStats(
  accessToken: string,
  signal?: AbortSignal,
  contactedWindowDays?: number,
): Promise<OverviewStats> {
  const { data, error, response } = await client.GET("/api/companies/overview", {
    params: {
      query: {
        contacted_window_days: contactedWindowDays,
      },
    },
    headers: { Authorization: `Bearer ${accessToken}` },
    signal,
  });

  if (error !== undefined) {
    throw new ApiError(describeFailure(response.status, error), response.status);
  }
  if (data === undefined) {
    throw new ApiError("Could not reach the companies service. Check that it is running and that this origin is allowed.", 0);
  }

  return data as OverviewStats;
}
