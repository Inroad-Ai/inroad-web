"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchCompany,
  researchCompanyDomain,
  saveCompanyResearch,
  updateCompanyNotes,
  updateCompanyStage,
} from "@/lib/api-client/client";
import { describeHiring } from "@/lib/companies";
import { createClient } from "@/lib/supabase/browser";
import { totalTimeSeconds } from "@/lib/api";
import type { Company, CompanyDetail, ResearchRunSummary } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Menu } from "@/components/ui/Menu";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { PIPELINE_STAGES, StatusBadge, type PipelineStage } from "@/components/ui/StatusBadge";

const SESSION_EXPIRED = "Your session expired. Sign in again to see this company.";

// Longer than the table's rows: history stays collapsed only when there is
// more to hide than to show.
const COLLAPSED_RUN_COUNT = 3;

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CompanyProfile({ companyId }: { companyId: string }) {
  const supabase = useMemo(() => createClient(), []);

  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "error" | "ready">("loading");
  const [loadError, setLoadError] = useState("");

  const accessToken = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error(SESSION_EXPIRED);
    return session.access_token;
  }, [supabase]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const token = await accessToken();
        setDetail(await fetchCompany(companyId, token, controller.signal));
        setLoadState("ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        setLoadError(err instanceof Error ? err.message : "Could not load this company.");
        setLoadState("error");
      }
    }

    load();
    return () => controller.abort();
  }, [companyId, accessToken]);

  if (loadState === "loading") return <ProfileSkeleton />;

  if (loadState === "error" || detail === null) {
    return (
      <div className="mt-6 rounded-md border border-line bg-surface">
        <EmptyState className="px-6 py-16 text-center">{loadError}</EmptyState>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      <IdentityHeader
        detail={detail}
        accessToken={accessToken}
        onCompanyChange={(company) => setDetail({ ...detail, ...company })}
        onResearched={setDetail}
        refresh={async () => fetchCompany(companyId, await accessToken())}
      />
      <HiringSection detail={detail} />
      <LatestResearchSection detail={detail} />
      <NotesSection
        detail={detail}
        accessToken={accessToken}
        onSaved={(company) => setDetail({ ...detail, ...company })}
      />
      <ResearchHistorySection detail={detail} />
    </div>
  );
}

function IdentityHeader({
  detail,
  accessToken,
  onCompanyChange,
  onResearched,
  refresh,
}: {
  detail: CompanyDetail;
  accessToken: () => Promise<string>;
  onCompanyChange: (company: Company) => void;
  onResearched: (detail: CompanyDetail) => void;
  refresh: () => Promise<CompanyDetail>;
}) {
  const [movingStage, setMovingStage] = useState(false);
  const [stageError, setStageError] = useState("");
  const [rerunning, setRerunning] = useState(false);
  const [rerunError, setRerunError] = useState("");

  // The same PATCH the Pipeline board uses, so a stage moved here and a card
  // dragged there go through one code path and one set of side effects.
  async function moveToStage(stage: PipelineStage) {
    if (stage === detail.stage) return;
    setMovingStage(true);
    setStageError("");
    try {
      const updated = await updateCompanyStage(detail.id, stage, await accessToken());
      onCompanyChange(updated);
    } catch (err) {
      setStageError(err instanceof Error ? err.message : "Could not change the stage.");
    } finally {
      setMovingStage(false);
    }
  }

  /**
   * Three calls on purpose: research, save, then re-read. The save returns
   * only the company row, and the page also needs the new research_runs row
   * it wrote, which the detail endpoint is the only thing that returns.
   */
  async function rerunResearch() {
    setRerunning(true);
    setRerunError("");
    try {
      const token = await accessToken();
      const dossier = await researchCompanyDomain(detail.domain, token);
      await saveCompanyResearch(dossier, token);
      onResearched(await refresh());
    } catch (err) {
      setRerunError(err instanceof Error ? err.message : "Could not run research again.");
    } finally {
      setRerunning(false);
    }
  }

  return (
    <section className="rounded-md border border-line bg-surface p-7 shadow-overlay">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="utility-label text-text-secondary">Domain</p>
          <p className="mt-1 font-display text-2xl text-ink">{detail.domain}</p>
          {detail.homepage_title ? (
            <p className="mt-2 max-w-xl text-sm leading-snug text-text-secondary">
              {detail.homepage_title}
            </p>
          ) : null}
          {detail.homepage_url ? (
            <a
              href={detail.homepage_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
            >
              {detail.homepage_url}
            </a>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge stage={detail.stage} />
            <Menu
              label={`Change the stage for ${detail.domain}`}
              trigger={movingStage ? "Changing..." : "Change stage"}
              disabled={movingStage}
              items={PIPELINE_STAGES.map((stage) => ({
                key: stage,
                label: <StatusBadge stage={stage} />,
                disabled: stage === detail.stage,
                onSelect: () => moveToStage(stage),
              }))}
            />
          </div>
          <Button onClick={rerunResearch} disabled={rerunning} className="px-5 py-2.5">
            {rerunning ? "Checking again..." : "Run research again"}
          </Button>
          <p className="utility-label text-text-secondary/70">
            Last researched {formatTimestamp(detail.updated_at)}
          </p>
        </div>
      </div>

      {stageError ? (
        <p className="mt-4 text-sm text-error" role="alert">
          {stageError}
        </p>
      ) : null}
      {rerunError ? (
        <p className="mt-4 text-sm text-error" role="alert">
          {rerunError}
        </p>
      ) : null}
    </section>
  );
}

function Section({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-line bg-surface shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        <span className="utility-label text-text-secondary">{title}</span>
        {meta}
      </header>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="utility-label text-text-secondary/70">{label}</dt>
      <dd className="mt-1 font-sans text-sm text-ink">{children}</dd>
    </div>
  );
}

function HiringSection({ detail }: { detail: CompanyDetail }) {
  const hiring = describeHiring(detail);

  return (
    <Section title="Hiring">
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Status">
          {detail.is_hiring === null ? (
            <span className="text-text-secondary">Could not tell</span>
          ) : detail.is_hiring ? (
            "Hiring"
          ) : (
            <span className="text-text-secondary">Not hiring</span>
          )}
        </Field>
        {/* null ("could not count") and 0 ("counted, none open") read
            differently here, the same way they do in the table. */}
        <Field label="Open roles">
          <span className={hiring.muted ? "text-text-secondary" : ""}>{hiring.label}</span>
        </Field>
        <Field label="Board">
          {detail.hiring_source ?? <span className="text-text-secondary">Unknown</span>}
        </Field>
        <Field label="Careers page">
          {detail.careers_url ? (
            <a
              href={detail.careers_url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
            >
              {detail.careers_url}
            </a>
          ) : (
            <span className="text-text-secondary">None found</span>
          )}
        </Field>
      </dl>

      <div className="mt-6">
        <p className="utility-label text-text-secondary/70">Sample roles</p>
        {detail.sample_roles.length === 0 ? (
          <EmptyState className="mt-2">No role titles came back with the last run.</EmptyState>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {detail.sample_roles.map((role) => (
              <li key={role} className="text-sm text-ink">
                {role}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}

function LatestResearchSection({ detail }: { detail: CompanyDetail }) {
  const research = detail.latest_research;

  if (research === null) {
    return (
      <Section title="Latest research">
        <EmptyState>
          Nothing saved for this company yet. Run research again to fill this in.
        </EmptyState>
      </Section>
    );
  }

  const homepage = research.homepage;
  const news = research.news;
  const failedSources = Object.entries(research.errors);

  return (
    <Section
      title="Latest research"
      meta={
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={research.from_cache ? "amber" : "teal"}>
            {research.from_cache ? "Served from cache" : "Fetched live"}
          </Badge>
          <span className="utility-label text-text-secondary/70">
            {totalTimeSeconds(research.elapsed_ms)}s
          </span>
        </div>
      }
    >
      {/* A partial run is still a 200 with nulls in it. Say so plainly rather
          than letting the empty fields below read as "nothing to report". */}
      {research.partial ? (
        <div
          role="status"
          className="mb-5 rounded-sm border border-muted-rose/40 bg-muted-rose-subtle p-5"
        >
          <p className="utility-label text-muted-rose">This run came back incomplete</p>
          <p className="mt-2 text-sm text-text-secondary">
            {failedSources.length} of 3 sources did not answer, so what is below may be out of
            date or missing. Run research again to try those sources once more.
          </p>
          {failedSources.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {failedSources.map(([source, reason]) => (
                <li key={source} className="text-sm text-text-secondary">
                  <span className="text-ink">{source}</span>: {reason}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="utility-label text-text-secondary/70">Homepage</p>
          {homepage === null ? (
            <EmptyState className="mt-2">The site did not answer on the last run.</EmptyState>
          ) : (
            <>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {homepage.description ?? "No description on the page."}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                <Field label="Words">{homepage.word_count.toLocaleString()}</Field>
                <Field label="Headings">{homepage.headings.length}</Field>
              </dl>
              {homepage.headings.length > 0 ? (
                <ul className="mt-4 space-y-1.5">
                  {homepage.headings.map((heading, index) => (
                    <li key={`${heading}-${index}`} className="text-sm text-ink">
                      {heading}
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>

        <div>
          <p className="utility-label text-text-secondary/70">News</p>
          {news === null ? (
            <EmptyState className="mt-2">The news check did not answer on the last run.</EmptyState>
          ) : news.items.length === 0 ? (
            <EmptyState className="mt-2">Nothing published about this company recently.</EmptyState>
          ) : (
            <ul className="mt-2 space-y-4">
              {news.items.map((item, index) => (
                <li key={`${item.link ?? item.title}-${index}`}>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm leading-snug text-ink underline decoration-line underline-offset-4 hover:decoration-signal-teal"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className="text-sm leading-snug text-ink">{item.title}</span>
                  )}
                  {item.source || item.published ? (
                    <span className="utility-label mt-1 block text-text-secondary/70">
                      {[item.source, item.published].filter(Boolean).join(" - ")}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}

function NotesSection({
  detail,
  accessToken,
  onSaved,
}: {
  detail: CompanyDetail;
  accessToken: () => Promise<string>;
  onSaved: (company: Company) => void;
}) {
  const [text, setText] = useState(detail.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const dirty = text !== (detail.notes ?? "");

  async function save() {
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      // Empty box means "no notes", not an empty string sitting in the column.
      const trimmed = text.trim();
      const updated = await updateCompanyNotes(
        detail.id,
        trimmed === "" ? null : trimmed,
        await accessToken(),
      );
      onSaved(updated);
      setText(updated.notes ?? "");
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save these notes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section
      title="Notes"
      meta={
        <span className="utility-label text-text-secondary/70">
          {saving ? "Saving..." : dirty ? "Unsaved changes" : saved ? "Saved" : ""}
        </span>
      }
    >
      <label htmlFor="company-notes" className="sr-only">
        Notes about {detail.domain}
      </label>
      <Textarea
        id="company-notes"
        rows={6}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setSaved(false);
        }}
        placeholder="Who you spoke to, what you sent, what to follow up on."
      />
      <div className="mt-3 flex items-center gap-4">
        <Button variant="quiet" onClick={save} disabled={saving || !dirty} className="px-5 py-2.5">
          {saving ? "Saving..." : "Save notes"}
        </Button>
        <span className="text-xs text-text-secondary/70">
          Notes save when you press the button, not as you type.
        </span>
      </div>
      {saveError ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {saveError}
        </p>
      ) : null}
    </Section>
  );
}

function ResearchHistorySection({ detail }: { detail: CompanyDetail }) {
  const runs = detail.recent_research_runs;
  const [expanded, setExpanded] = useState(false);

  const collapsible = runs.length > COLLAPSED_RUN_COUNT;
  const shown = collapsible && !expanded ? runs.slice(0, COLLAPSED_RUN_COUNT) : runs;
  // The backend caps what it sends, so the count can exceed what is listed.
  const olderNotSent = detail.research_run_count - runs.length;

  return (
    <Section
      title="Research history"
      meta={
        <span className="utility-label text-text-secondary/70">
          {detail.research_run_count} {detail.research_run_count === 1 ? "run" : "runs"}
        </span>
      }
    >
      {runs.length === 0 ? (
        <EmptyState>No runs recorded for this company yet.</EmptyState>
      ) : (
        <>
          <ul className="divide-y divide-line">
            {shown.map((run) => (
              <RunRow key={run.id} run={run} />
            ))}
          </ul>

          {collapsible ? (
            <Button
              variant="quiet"
              onClick={() => setExpanded((value) => !value)}
              className="mt-4 px-5 py-2.5"
            >
              {expanded
                ? "Show fewer"
                : `Show all ${runs.length} recent runs`}
            </Button>
          ) : null}

          {olderNotSent > 0 ? (
            <p className="mt-4 text-xs text-text-secondary/70">
              {olderNotSent} older {olderNotSent === 1 ? "run is" : "runs are"} kept but not shown
              here.
            </p>
          ) : null}
        </>
      )}
    </Section>
  );
}

function RunRow({ run }: { run: ResearchRunSummary }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <span className="text-sm text-ink">{formatTimestamp(run.created_at)}</span>
      <span className="flex flex-wrap items-center gap-3">
        {run.partial ? <Badge tone="rose">Partial</Badge> : <Badge tone="neutral">Complete</Badge>}
        <Badge tone={run.from_cache ? "amber" : "teal"}>
          {run.from_cache ? "Cached" : "Live"}
        </Badge>
        <span className="utility-label text-text-secondary/70">
          {totalTimeSeconds(run.elapsed_ms)}s
        </span>
      </span>
    </li>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="rounded-md border border-line bg-surface p-7">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-3 h-6 w-48" />
        <Skeleton className="mt-3 h-4 w-64" />
      </div>
      {[0, 1].map((index) => (
        <div key={index} className="rounded-md border border-line bg-surface px-6 py-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
