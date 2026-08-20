"use client";

import { useEffect, useState } from "react";

import { fetchJobs } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { SESSION_EXPIRED } from "@/lib/companies";
import type { Job } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 300;

type LoadState = "loading" | "error" | "ready";

export function JobBoard() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [state, setState] = useState<LoadState>("loading");
  const [data, setData] = useState<{ items: Job[]; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setState("loading");
      const token = await ensureValidAccessToken();
      if (!token) {
        setErrorMessage(SESSION_EXPIRED);
        setState("error");
        return;
      }

      try {
        const response = await fetchJobs(
          { search: search || undefined, page, pageSize: PAGE_SIZE },
          token,
          controller.signal,
        );
        setData({ items: response.items, total: response.total });
        setState("ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        setErrorMessage(err instanceof Error ? err.message : "Could not load the job board.");
        setState("error");
      }
    }

    load();
    return () => controller.abort();
  }, [search, page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div>
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search by role or company..."
        className="max-w-xs"
        aria-label="Search jobs by role or company"
      />

      <div className="mt-4">
        <JobBoardBody
          state={state}
          data={data}
          errorMessage={errorMessage}
          hasFilters={search !== ""}
        />
      </div>

      {state === "ready" && data && data.items.length > 0 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-text-secondary">
          <span>
            {data.total} {data.total === 1 ? "role" : "roles"} - page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="quiet"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="quiet"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function JobBoardBody({
  state,
  data,
  errorMessage,
  hasFilters,
}: {
  state: LoadState;
  data: { items: Job[]; total: number } | null;
  errorMessage: string;
  hasFilters: boolean;
}) {
  if (state === "error") {
    return (
      <EmptyState className="rounded-md border border-line bg-surface px-6 py-16 text-center">
        {errorMessage}
      </EmptyState>
    );
  }

  if (state === "loading") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-md border border-line bg-surface p-5">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="mt-4 h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // A job with no application link anywhere can't do anything useful on this
  // card - shouldn't happen given the dedup key includes title, but the ATS
  // APIs are external and occasionally sparse.
  const applicable = (data?.items ?? []).filter(
    (job): job is Job & { url: string } => Boolean(job.url),
  );

  if (applicable.length === 0) {
    return (
      <EmptyState className="rounded-md border border-line bg-surface px-6 py-16 text-center">
        {hasFilters
          ? "No roles match this search."
          : "No jobs yet - research a company to seed the board."}
      </EmptyState>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {applicable.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }: { job: Job & { url: string } }) {
  return (
    <article className="flex flex-col gap-4 rounded-md border border-line bg-surface p-5 shadow-card transition-colors hover:border-signal-teal/40">
      <div className="flex items-start gap-3">
        <CompanyLogo logoUrl={null} domain={job.domain} className="h-10 w-10" />
        <div className="min-w-0">
          <p className="font-sans text-base leading-snug text-ink">{job.title}</p>
          <p className="text-sm text-text-secondary">{job.company_name}</p>
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        <Button href={job.url} target="_blank" rel="noopener noreferrer" className="flex-1">
          Apply
        </Button>
        <Button variant="quiet" disabled className="flex-1" title="Coming soon">
          Outreach
        </Button>
      </div>
    </article>
  );
}
