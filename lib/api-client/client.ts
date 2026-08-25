/** Typed wrapper around the FastAPI backend. See README.md to regenerate. */

import createClient from "openapi-fetch";

import type {
  Company,
  CompanyDetail,
  CompanyListResponse,
  CompanySort,
  OverviewStats,
  Person,
  PersonDetail,
  PersonListResponse,
} from "@/lib/types";
import type { PipelineStage } from "@/components/ui/StatusBadge";
import type { PersonStage } from "@/components/ui/PersonStageBadge";
import type { components, paths } from "./schema";

export type TokenPair = components["schemas"]["TokenPair"];
export type CurrentUser = components["schemas"]["CurrentUser"];
export type Profile = components["schemas"]["ProfileOut"];
export type ProfileUpsert = components["schemas"]["ProfileUpsert"];
export type Connection = components["schemas"]["ConnectionOut"];
// Mirrors schemas/connection.py's ConnectionProvider literal - widens on its
// own the next time schema.d.ts is regenerated after a new provider ships.
export type ConnectionProvider =
  paths["/api/connections/{provider}"]["put"]["parameters"]["path"]["provider"];
export type ResumeParseResult = components["schemas"]["ResumeParseResult"];
export type WorkHistoryEntry = components["schemas"]["WorkHistoryEntry"];
export type EducationEntry = components["schemas"]["EducationEntry"];
export type ProjectEntry = components["schemas"]["ProjectEntry"];

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

const client = createClient<paths>({ baseUrl: BASE_URL });

/** Transport failures and 4xx/5xx. A partial dossier is a 200 and never lands here. */
export class ApiError extends Error {
  readonly status: number;
  /** The backend's machine-readable error code, when it sent one. Callers
   * branch on this rather than matching on message text. */
  readonly code: string | null;

  constructor(message: string, status: number, code: string | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

interface ApiResult<T> {
  data?: T;
  error?: unknown;
  response: Response;
}

function errorEnvelope(body: unknown): { code?: string; message?: string } | null {
  if (body && typeof body === "object" && "error" in body) {
    const envelope = (body as { error?: { code?: string; message?: string } }).error;
    if (envelope && typeof envelope === "object") return envelope;
  }
  return null;
}

function describeFailure(status: number, body: unknown): string {
  const envelope = errorEnvelope(body);
  if (envelope?.message) return envelope.message;
  if (body && typeof body === "object" && typeof (body as { detail?: unknown }).detail === "string") {
    return (body as { detail: string }).detail;
  }
  if (status === 422) return "That does not look like a usable domain.";
  return `The service returned ${status}.`;
}

/** Every call has the same three outcomes to sort out - an error body, a
 * response that never arrived, and the success case - so they share one
 * unwrapper rather than repeating it per function. */
function unwrap<T>(result: ApiResult<T>, unreachable: string): T {
  const { data, error, response } = result;

  if (error !== undefined) {
    throw new ApiError(
      describeFailure(response.status, error),
      response.status,
      errorEnvelope(error)?.code ?? null,
    );
  }
  if (data === undefined) {
    throw new ApiError(unreachable, 0);
  }

  return data;
}

const COMPANIES_UNREACHABLE =
  "Could not reach the companies service. Check that it is running and that this origin is allowed.";
const AUTH_UNREACHABLE = "Could not reach the auth service.";
const PROFILE_UNREACHABLE = "Could not reach the profile service.";
const RESUME_UNREACHABLE = "Could not reach the resume service.";

function authHeaders(accessToken: string): Record<string, string> {
  return { Authorization: `Bearer ${accessToken}` };
}

// --- companies ---

export interface FetchCompaniesParams {
  search?: string;
  stage?: PipelineStage;
  sort?: CompanySort;
  page?: number;
  pageSize?: number;
}

export async function fetchCompanies(
  params: FetchCompaniesParams,
  accessToken: string,
  signal?: AbortSignal,
): Promise<CompanyListResponse> {
  const result = await client.GET("/api/companies", {
    params: {
      query: {
        search: params.search || undefined,
        stage: params.stage,
        sort: params.sort,
        page: params.page,
        page_size: params.pageSize,
      },
    },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, COMPANIES_UNREACHABLE) as CompanyListResponse;
}

/** The saved row plus its latest dossier and research trail. */
export async function fetchCompany(
  companyId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<CompanyDetail> {
  const result = await client.GET("/api/companies/{company_id}", {
    params: { path: { company_id: companyId } },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, COMPANIES_UNREACHABLE) as CompanyDetail;
}

/** Researches a domain and saves it in one call - there is no preview step.
 * Upserts on (user_id, domain) and appends a research_runs row; pipeline
 * state on an existing company row is left alone. */
export async function researchCompanyDomain(
  domain: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Company> {
  const result = await client.POST("/api/companies/research", {
    params: { query: { domain: domain.trim() } },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, COMPANIES_UNREACHABLE) as Company;
}

/** Notes only. Stage goes through updateCompanyStage, which the backend
 * treats differently: it also stamps contacted_at. */
export async function updateCompanyNotes(
  companyId: string,
  notes: string | null,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Company> {
  const result = await client.PATCH("/api/companies/{company_id}", {
    params: { path: { company_id: companyId } },
    body: { notes },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, COMPANIES_UNREACHABLE) as Company;
}

/** Render the row this returns: a first move into "contacted" also stamps
 * `contacted_at`, so the response differs from the request by more than stage. */
export async function updateCompanyStage(
  companyId: string,
  stage: PipelineStage,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Company> {
  const result = await client.PATCH("/api/companies/{company_id}/stage", {
    params: { path: { company_id: companyId } },
    body: { stage },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, COMPANIES_UNREACHABLE) as Company;
}

/** Who the user has picked as the outreach target for this company. `null`
 * clears it. Rejects an id that isn't one of this company's own people. */
export async function setPrimaryContact(
  companyId: string,
  personId: string | null,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Company> {
  const result = await client.PATCH("/api/companies/{company_id}/primary-contact", {
    params: { path: { company_id: companyId } },
    body: { person_id: personId },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, COMPANIES_UNREACHABLE) as Company;
}

/** Aggregates for the Overview page. */
export async function fetchOverviewStats(
  accessToken: string,
  signal?: AbortSignal,
  contactedWindowDays?: number,
): Promise<OverviewStats> {
  const result = await client.GET("/api/companies/overview", {
    params: { query: { contacted_window_days: contactedWindowDays } },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, COMPANIES_UNREACHABLE) as OverviewStats;
}

// --- people ---

const PEOPLE_UNREACHABLE =
  "Could not reach the people service. Check that it is running and that this origin is allowed.";

export interface FetchPeopleParams {
  stage?: PersonStage;
  page?: number;
  pageSize?: number;
}

/** One row per person, across every company - what the contacts board's
 * columns page through. */
export async function fetchPeople(
  params: FetchPeopleParams,
  accessToken: string,
  signal?: AbortSignal,
): Promise<PersonListResponse> {
  const result = await client.GET("/api/people", {
    params: {
      query: { stage: params.stage, page: params.page, page_size: params.pageSize },
    },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, PEOPLE_UNREACHABLE) as PersonListResponse;
}

/** A person's own row plus enough about their company to show context and
 * link back to it. */
export async function fetchPerson(
  personId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<PersonDetail> {
  const result = await client.GET("/api/people/{person_id}", {
    params: { path: { person_id: personId } },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, PEOPLE_UNREACHABLE) as PersonDetail;
}

/** A first move into "contacted" also stamps contacted_at, same rule as
 * updateCompanyStage - render the row this returns, not just the stage. */
export async function updatePersonStage(
  personId: string,
  stage: PersonStage,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Person> {
  const result = await client.PATCH("/api/people/{person_id}/stage", {
    params: { path: { person_id: personId } },
    body: { stage },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, PEOPLE_UNREACHABLE) as Person;
}

// --- auth ---

/** No session comes back: the account isn't usable until the emailed
 * confirmation link is clicked. */
export async function signup(email: string, password: string): Promise<string> {
  const result = await client.POST("/api/auth/signup", { body: { email, password } });

  return unwrap(result, AUTH_UNREACHABLE).detail;
}

export async function login(email: string, password: string): Promise<TokenPair> {
  const result = await client.POST("/api/auth/login", { body: { email, password } });

  return unwrap(result, AUTH_UNREACHABLE);
}

/** Signs the user in as well as confirming the address: they just proved
 * they own the inbox. */
export async function verifyEmail(token: string): Promise<TokenPair> {
  const result = await client.POST("/api/auth/verify-email", { body: { token } });

  return unwrap(result, AUTH_UNREACHABLE);
}

export async function resendVerification(email: string): Promise<string> {
  const result = await client.POST("/api/auth/resend-verification", { body: { email } });

  return unwrap(result, AUTH_UNREACHABLE).detail;
}

/** Succeeds whether or not the address is registered, so the response can't
 * be used to test which addresses have accounts. */
export async function forgotPassword(email: string): Promise<string> {
  const result = await client.POST("/api/auth/forgot-password", { body: { email } });

  return unwrap(result, AUTH_UNREACHABLE).detail;
}

/** Hands back a session: reaching the emailed link already proved the
 * account is theirs. Every session that existed before the reset is
 * revoked, this one included, so it is issued after that sweep. */
export async function resetPassword(token: string, password: string): Promise<TokenPair> {
  const result = await client.POST("/api/auth/reset-password", { body: { token, password } });

  return unwrap(result, AUTH_UNREACHABLE);
}

/** Full page navigation, not fetch: the backend redirects to Google, and a
 * cross-origin redirect can't be followed by an XHR. */
export function googleSignInUrl(): string {
  return `${BASE_URL}/api/auth/google/start`;
}

/** Throws on an invalid/expired/revoked refresh token; callers treat that
 * as "sign the user out locally," not a retryable failure. */
export async function refreshNative(refreshToken: string): Promise<string> {
  const result = await client.POST("/api/auth/refresh", {
    body: { refresh_token: refreshToken },
  });

  return unwrap(result, AUTH_UNREACHABLE).access_token;
}

/** Best-effort: the caller clears local state regardless of whether this
 * succeeds, so a network error here shouldn't stop sign-out. */
export async function logoutNative(refreshToken: string): Promise<void> {
  await client.POST("/api/auth/logout", { body: { refresh_token: refreshToken } });
}

/** The signed-in account. The token says whose, so there's no id to pass. */
export async function fetchMe(
  accessToken: string,
  signal?: AbortSignal,
): Promise<CurrentUser> {
  const result = await client.GET("/api/auth/me", {
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, AUTH_UNREACHABLE);
}

// --- profile ---

/** Null, not a throw, when there's no profile yet: callers route on it
 * rather than treating it as an error. */
export async function fetchProfile(
  accessToken: string,
  signal?: AbortSignal,
): Promise<Profile | null> {
  const result = await client.GET("/api/profile", {
    headers: authHeaders(accessToken),
    signal,
  });

  if (result.response.status === 404) return null;

  return unwrap(result, PROFILE_UNREACHABLE);
}

/** Parses and returns; nothing is saved and the file is never stored. What
 * the user confirms afterwards goes through saveProfile like any other edit. */
export async function parseResume(
  file: File,
  accessToken: string,
  signal?: AbortSignal,
): Promise<ResumeParseResult> {
  const result = await client.POST("/api/resume/parse", {
    // The generated body type calls `file` a string, which is how
    // openapi-typescript renders a binary part. FormData is what actually
    // goes on the wire, so the serializer is the real contract here.
    body: { file: file as unknown as string },
    bodySerializer(body: { file: unknown }) {
      const form = new FormData();
      form.append("file", body.file as Blob);
      return form;
    },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, RESUME_UNREACHABLE);
}

/** Upsert: creates from onboarding, rewrites from settings. Whose row it is
 * comes from the token, never the body. */
export async function saveProfile(
  profile: ProfileUpsert,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Profile> {
  const result = await client.PUT("/api/profile", {
    body: profile,
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, PROFILE_UNREACHABLE);
}

// --- connections ---

const CONNECTIONS_UNREACHABLE = "Could not reach the connections service.";

/** Every provider the caller has ever saved a key for. Empty on first visit. */
export async function fetchConnections(
  accessToken: string,
  signal?: AbortSignal,
): Promise<Connection[]> {
  const result = await client.GET("/api/connections", {
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, CONNECTIONS_UNREACHABLE);
}

/** Validates the key against the provider before saving - a rejected key
 * comes back as a 422 with code "connection_invalid", nothing is persisted. */
export async function saveConnection(
  provider: ConnectionProvider,
  apiKey: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Connection> {
  const result = await client.PUT("/api/connections/{provider}", {
    params: { path: { provider } },
    body: { api_key: apiKey },
    headers: authHeaders(accessToken),
    signal,
  });

  return unwrap(result, CONNECTIONS_UNREACHABLE);
}

export async function deleteConnection(
  provider: ConnectionProvider,
  accessToken: string,
  signal?: AbortSignal,
): Promise<void> {
  const result = await client.DELETE("/api/connections/{provider}", {
    params: { path: { provider } },
    headers: authHeaders(accessToken),
    signal,
  });

  if (result.response.status !== 204) unwrap(result, CONNECTIONS_UNREACHABLE);
}
