/** Typed wrapper around the FastAPI backend. See README.md to regenerate. */

import createClient from "openapi-fetch";

import type {
  Company,
  CompanyDetail,
  CompanyDossier,
  CompanyListResponse,
  CompanySort,
  OverviewStats,
} from "@/lib/types";
import type { PipelineStage } from "@/components/ui/StatusBadge";
import type { paths } from "./schema";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

const client = createClient<paths>({ baseUrl: BASE_URL });

/** Transport failures and 4xx/5xx. A partial dossier is a 200 and never lands here. */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function describeFailure(status: number, body: unknown): string {
  if (body && typeof body === "object" && typeof (body as { detail?: unknown }).detail === "string") {
    return (body as { detail: string }).detail;
  }
  if (status === 422) return "That does not look like a usable domain.";
  return `The research service returned ${status}.`;
}

/** Resolves even for a partial dossier; only bad input and transport problems reject. */
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

/** Newest first. Server-side memory, so it empties on backend restart. */
export async function fetchHistory(signal?: AbortSignal): Promise<CompanyDossier[]> {
  const { data, response } = await client.GET("/api/research/history", { signal });

  if (data === undefined) {
    throw new ApiError(`The research service returned ${response.status}.`, response.status);
  }

  return data as CompanyDossier[];
}

const COMPANIES_UNREACHABLE =
  "Could not reach the companies service. Check that it is running and that this origin is allowed.";

export interface FetchCompaniesParams {
  search?: string;
  stage?: PipelineStage;
  sort?: CompanySort;
  page?: number;
  pageSize?: number;
}

/** The token is forwarded to Postgres as-is: RLS scopes the rows, not this. */
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
    throw new ApiError(COMPANIES_UNREACHABLE, 0);
  }

  return data as CompanyListResponse;
}

/** The saved row plus its latest dossier and research trail, for the profile page. */
export async function fetchCompany(
  companyId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<CompanyDetail> {
  const { data, error, response } = await client.GET("/api/companies/{company_id}", {
    params: { path: { company_id: companyId } },
    headers: { Authorization: `Bearer ${accessToken}` },
    signal,
  });

  if (error !== undefined) {
    throw new ApiError(describeFailure(response.status, error), response.status);
  }
  if (data === undefined) {
    throw new ApiError(COMPANIES_UNREACHABLE, 0);
  }

  return data as CompanyDetail;
}

/** Notes only. Stage goes through updateCompanyStage, which the backend
 * treats differently: it also stamps contacted_at. */
export async function updateCompanyNotes(
  companyId: string,
  notes: string | null,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Company> {
  const { data, error, response } = await client.PATCH("/api/companies/{company_id}", {
    params: { path: { company_id: companyId } },
    body: { notes },
    headers: { Authorization: `Bearer ${accessToken}` },
    signal,
  });

  if (error !== undefined) {
    throw new ApiError(describeFailure(response.status, error), response.status);
  }
  if (data === undefined) {
    throw new ApiError(COMPANIES_UNREACHABLE, 0);
  }

  return data as Company;
}

/**
 * Runs the three checks again for a domain the user already has. Nothing is
 * written yet: saveCompanyResearch persists what comes back.
 */
export async function researchCompanyDomain(
  domain: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<CompanyDossier> {
  const { data, error, response } = await client.POST("/api/companies/research", {
    params: { query: { domain: domain.trim() } },
    headers: { Authorization: `Bearer ${accessToken}` },
    signal,
  });

  if (error !== undefined) {
    throw new ApiError(describeFailure(response.status, error), response.status);
  }
  if (data === undefined) {
    throw new ApiError(COMPANIES_UNREACHABLE, 0);
  }

  return data as CompanyDossier;
}

/** Upserts on (user_id, domain) and appends a research_runs row. Pipeline
 * state on the existing company row is left alone. */
export async function saveCompanyResearch(
  dossier: CompanyDossier,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Company> {
  const { data, error, response } = await client.POST("/api/companies", {
    body: { dossier },
    headers: { Authorization: `Bearer ${accessToken}` },
    signal,
  });

  if (error !== undefined) {
    throw new ApiError(describeFailure(response.status, error), response.status);
  }
  if (data === undefined) {
    throw new ApiError(COMPANIES_UNREACHABLE, 0);
  }

  return data as Company;
}

/** Render the row this returns: a first move into "contacted" also stamps
 * `contacted_at`, so the response differs from the request by more than stage. */
export async function updateCompanyStage(
  companyId: string,
  stage: PipelineStage,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Company> {
  const { data, error, response } = await client.PATCH("/api/companies/{company_id}/stage", {
    params: { path: { company_id: companyId } },
    body: { stage },
    headers: { Authorization: `Bearer ${accessToken}` },
    signal,
  });

  if (error !== undefined) {
    throw new ApiError(describeFailure(response.status, error), response.status);
  }
  if (data === undefined) {
    throw new ApiError(COMPANIES_UNREACHABLE, 0);
  }

  return data as Company;
}

/** Aggregates for the Overview page. Same auth shape as fetchCompanies. */
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
    throw new ApiError(COMPANIES_UNREACHABLE, 0);
  }

  return data as OverviewStats;
}
