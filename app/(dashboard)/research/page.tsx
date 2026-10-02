"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { PageShell } from "@/components/composed/dashboard/PageShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusDot } from "@/components/ui/StatusDot";
import { ApiError, getMatchRun, startMatchRun } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { useResearchRuns, type ResearchRun } from "@/lib/research-runs";
import type { CardState, PipelineRunStatus } from "@/lib/types";

interface MatchRun {
  id: string;
  status: PipelineRunStatus;
  startedAt: number;
  error: string | null;
  matchedCompanyIds: string[];
  timedOut: boolean;
}

const MATCH_POLL_INTERVAL_MS = 3000;
const MATCH_POLL_MAX_ATTEMPTS = 40;

export default function ResearchPage() {
  const [domain, setDomain] = useState("");
  const { runs, startResearch } = useResearchRuns();
  const busy = runs.some((run) => run.state === "pending");
  const [matchBusy, setMatchBusy] = useState(false);
  const [matchRuns, setMatchRuns] = useState<MatchRun[]>([]);

  function runResearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextDomain = domain.trim();
    if (nextDomain && !busy) startResearch(nextDomain);
  }

  function settleMatch(runId: string, update: Partial<MatchRun>) {
    setMatchRuns((previous) =>
      previous.map((run) => (run.id === runId ? { ...run, ...update } : run)),
    );
  }

  async function pollMatch(runId: string, token: string, attempt = 0) {
    try {
      const result = await getMatchRun(runId, token);
      settleMatch(runId, {
        status: result.status,
        error: result.error,
        matchedCompanyIds: result.matched_company_ids,
        timedOut: false,
      });
      if (result.status === "pending" || result.status === "running") {
        if (attempt + 1 >= MATCH_POLL_MAX_ATTEMPTS) {
          settleMatch(runId, { timedOut: true });
          return;
        }
        setTimeout(() => void pollMatch(runId, token, attempt + 1), MATCH_POLL_INTERVAL_MS);
      }
    } catch (error) {
      settleMatch(runId, {
        status: "failed",
        error: error instanceof ApiError ? error.message : "Lost track of this run's progress.",
      });
    }
  }

  async function retryMatchPoll(runId: string) {
    settleMatch(runId, { timedOut: false });
    const token = await ensureValidAccessToken();
    if (!token) {
      settleMatch(runId, {
        status: "failed",
        error: "Your session expired. Sign in again to check this.",
      });
      return;
    }
    void pollMatch(runId, token);
  }

  async function runMatch() {
    setMatchBusy(true);
    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setMatchRuns((previous) => [
          {
            id: `local-${Date.now()}`,
            status: "failed",
            startedAt: Date.now(),
            error: "Your session expired. Sign in again to run this.",
            matchedCompanyIds: [],
            timedOut: false,
          },
          ...previous,
        ]);
        return;
      }
      const initial = await startMatchRun(token);
      setMatchRuns((previous) => [
        {
          id: initial.id,
          status: initial.status,
          startedAt: Date.now(),
          error: initial.error,
          matchedCompanyIds: [],
          timedOut: false,
        },
        ...previous,
      ]);
      void pollMatch(initial.id, token);
    } catch (error) {
      setMatchRuns((previous) => [
        {
          id: `local-${Date.now()}`,
          status: "failed",
          startedAt: Date.now(),
          error:
            error instanceof ApiError
              ? error.message
              : "Something went wrong before the match could start.",
          matchedCompanyIds: [],
          timedOut: false,
        },
        ...previous,
      ]);
    } finally {
      setMatchBusy(false);
    }
  }

  return (
    <PageShell
      title="Research"
      description="Build focused company intelligence or discover roles aligned with your profile."
    >
      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.8fr)]">
        <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
          <div className="border-b border-line bg-surface-raised/50 px-6 py-5 sm:px-8">
            <p className="utility-label text-signal-teal">Company intelligence</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Start with a company domain</h2>
            <p className="mt-1 max-w-xl text-sm text-text-secondary">
              We&apos;ll consolidate the company&apos;s profile, hiring signals, and relevant
              context into a research brief.
            </p>
          </div>
          <form onSubmit={runResearch} className="px-6 py-6 sm:px-8">
            <label htmlFor="research-domain" className="text-sm font-medium text-ink">
              Company website
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Input
                id="research-domain"
                name="domain"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder="e.g. stripe.com"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                disabled={busy}
                className="min-w-0 flex-1"
              />
              <Button
                type="submit"
                disabled={busy || domain.trim().length === 0}
                className="shrink-0 px-6"
              >
                {busy ? "Research in progress" : "Research company"}
              </Button>
            </div>
            <div className="mt-5 grid gap-3 border-t border-line pt-5 text-sm text-text-secondary sm:grid-cols-3">
              <ProcessStep number="01" label="Verify company" />
              <ProcessStep number="02" label="Gather signals" />
              <ProcessStep number="03" label="Create brief" />
            </div>
          </form>
        </div>
        <aside className="rounded-lg border border-signal-teal/20 bg-signal-teal-subtle/55 p-6 shadow-card sm:p-7">
          <p className="utility-label text-signal-teal">Profile-led discovery</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">Find your next best-fit company</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Search current hiring signals against your target roles, skills, and work preferences.
          </p>
          <Button
            variant="quiet"
            onClick={runMatch}
            disabled={matchBusy}
            className="mt-6 w-full border-signal-teal/30 bg-surface px-5"
          >
            {matchBusy ? "Starting match scan..." : "Run job match scan"}
          </Button>
          <p className="mt-3 text-center text-xs text-text-secondary">
            Usually ready in 20-35 seconds
          </p>
        </aside>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <RunPanel
          title="Company research"
          subtitle="Your recent intelligence requests"
          count={runs.length}
          empty="Research a company to create your first brief."
        >
          {runs.map((run) => (
            <RunStatusRow key={run.id} kind="research" run={run} />
          ))}
        </RunPanel>
        <RunPanel
          title="Job match scans"
          subtitle="Companies matched to your profile"
          count={matchRuns.length}
          empty="Run a match scan to surface companies aligned with your profile."
        >
          {matchRuns.map((run) => (
            <RunStatusRow key={run.id} kind="match" run={run} onRetry={retryMatchPoll} />
          ))}
        </RunPanel>
      </section>
    </PageShell>
  );
}

function ProcessStep({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="utility-label text-signal-teal/70">{number}</span>
      <span>{label}</span>
    </div>
  );
}

function RunPanel({
  title,
  subtitle,
  count,
  empty,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  empty: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
      <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
        </div>
        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-surface-raised px-2 text-xs font-medium text-text-secondary">
          {count}
        </span>
      </header>
      {count === 0 ? (
        <div className="px-6 py-10 text-center">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised text-signal-teal">
            <span className="h-2 w-2 rounded-full bg-current" />
          </div>
          <p className="mt-3 text-sm text-text-secondary">{empty}</p>
        </div>
      ) : (
        <ul className="divide-y divide-line">{children}</ul>
      )}
    </div>
  );
}

function ActivityProgress({ label, startedAt }: { label: string; startedAt: number }) {
  const elapsedSeconds = useElapsedSeconds(startedAt);
  // The API does not expose phase completion. The bar therefore reflects
  // real elapsed time against the observed 35-second upper end, and stops
  // short of 100% until the server confirms completion.
  const progress = Math.min(90, Math.max(4, (elapsedSeconds / 35) * 90));
  const timingLabel =
    elapsedSeconds > 35
      ? `${elapsedSeconds}s elapsed - taking longer than usual`
      : `${elapsedSeconds}s elapsed - usually 20-35 sec`;

  return (
    <div className="mt-3" role="status" aria-live="polite">
      <div className="flex items-center justify-between gap-3 text-xs text-text-secondary">
        <span>{label}</span>
        <span>{timingLabel}</span>
      </div>
      <div
        className="mt-2 h-1 overflow-hidden rounded-full bg-signal-teal/10"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={35}
        aria-valuenow={Math.min(elapsedSeconds, 35)}
        aria-valuetext={`${elapsedSeconds} seconds elapsed. Still working.`}
      >
        <div
          className="h-full rounded-full bg-signal-teal transition-[width] duration-500 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function useElapsedSeconds(startedAt: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  return Math.max(0, Math.floor((now - startedAt) / 1000));
}

type RunStatusRowProps =
  | { kind: "research"; run: ResearchRun }
  | { kind: "match"; run: MatchRun; onRetry: (runId: string) => void };

function RunStatusRow(props: RunStatusRowProps) {
  const isResearch = props.kind === "research";
  const inFlight = isResearch
    ? props.run.state === "pending"
    : (props.run.status === "pending" || props.run.status === "running") && !props.run.timedOut;
  const dotState: CardState = isResearch
    ? props.run.state
    : props.run.timedOut || props.run.status === "failed"
      ? "failed"
      : inFlight
        ? "pending"
        : "done";
  const title = isResearch
    ? props.run.domain
    : props.run.timedOut
      ? "Taking longer than expected"
      : inFlight
        ? "Searching for relevant companies"
        : props.run.status === "failed"
          ? "Match scan could not complete"
          : props.run.matchedCompanyIds.length === 0
            ? "No new matches today"
            : `${props.run.matchedCompanyIds.length} ${props.run.matchedCompanyIds.length === 1 ? "company match" : "company matches"} found`;
  const description = isResearch
    ? props.run.state === "pending"
      ? "Building company intelligence"
      : props.run.state === "failed"
        ? "Research needs attention"
        : "Research brief ready"
    : inFlight
      ? "Using your profile and current hiring signals"
      : props.run.timedOut
        ? "The worker may still be processing this scan."
        : props.run.status === "failed"
          ? "No changes were made to your profile."
          : "Based on your saved preferences";
  const error = isResearch
    ? props.run.state === "failed"
      ? props.run.error
      : null
    : !props.run.timedOut && props.run.status === "failed"
      ? props.run.error
      : null;

  const details = (
    <>
      {inFlight ? (
        <ActivityProgress
          label={
            isResearch
              ? "Research is running in the background"
              : "Match scan is running in the background"
          }
          startedAt={props.run.startedAt}
        />
      ) : null}
      {props.kind === "match" && props.run.timedOut ? (
        <div className="mt-3">
          <Button variant="quiet" size="sm" onClick={() => props.onRetry(props.run.id)}>
            Check status
          </Button>
        </div>
      ) : null}
      {error ? (
        <p className="mt-3 rounded-sm bg-muted-rose-subtle px-3 py-2 text-sm text-error">{error}</p>
      ) : null}
      {props.kind === "match" &&
      props.run.status === "completed" &&
      props.run.matchedCompanyIds.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {props.run.matchedCompanyIds.map((companyId, index) => (
            <Link
              key={companyId}
              href={`/companies/${companyId}`}
              className="rounded-full border border-signal-teal/20 bg-signal-teal-subtle px-3 py-1.5 text-xs font-medium text-signal-teal transition-colors hover:bg-signal-teal hover:text-surface"
            >
              View match {index + 1}
            </Link>
          ))}
        </div>
      ) : null}
    </>
  );

  const content = (
    <div className="px-6 py-5">
      <div
        className={`flex flex-wrap justify-between gap-3 ${isResearch ? "items-center" : "items-start"}`}
      >
        <div className={`flex min-w-0 gap-3 ${isResearch ? "items-center" : "flex-1 items-start"}`}>
          <StatusDot state={dotState} />
          <div className={isResearch ? "min-w-0" : "min-w-0 flex-1"}>
            <p className="truncate text-sm font-medium text-ink">{title}</p>
            <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
            {!isResearch ? details : null}
          </div>
        </div>
        {isResearch && props.run.state === "done" ? (
          <span className="utility-label text-signal-teal">Open brief</span>
        ) : null}
      </div>
      {isResearch ? details : null}
    </div>
  );

  return (
    <li>
      {isResearch && props.run.state === "done" && props.run.companyId ? (
        <Link
          href={`/companies/${props.run.companyId}`}
          className="block transition-colors hover:bg-surface-raised/60"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}
