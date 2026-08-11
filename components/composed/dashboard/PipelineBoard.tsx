"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchCompanies, updateCompanyStage } from "@/lib/api-client/client";
import { describeHiring } from "@/lib/companies";
import { createClient } from "@/lib/supabase/browser";
import type { Company } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Menu } from "@/components/ui/Menu";
import { Skeleton } from "@/components/ui/Skeleton";
import { PIPELINE_STAGES, StatusBadge, type PipelineStage } from "@/components/ui/StatusBadge";

// Columns are never unbounded: some stages will hold hundreds of companies
// after the historical import, so each pages on demand.
const COLUMN_PAGE_SIZE = 20;

interface ColumnState {
  items: Company[];
  total: number;
  pagesLoaded: number;
  status: "loading" | "error" | "ready";
  loadingMore: boolean;
  errorMessage: string;
}

type BoardState = Record<PipelineStage, ColumnState>;

const EMPTY_COLUMN: ColumnState = {
  items: [],
  total: 0,
  pagesLoaded: 0,
  status: "loading",
  loadingMore: false,
  errorMessage: "",
};

function initialBoard(): BoardState {
  return Object.fromEntries(
    PIPELINE_STAGES.map((stage) => [stage, { ...EMPTY_COLUMN }]),
  ) as BoardState;
}

const SESSION_EXPIRED = "Your session expired. Sign in again to see your pipeline.";

export function PipelineBoard() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [moveErrors, setMoveErrors] = useState<Record<string, string>>({});

  const patchColumn = useCallback(
    (stage: PipelineStage, patch: Partial<ColumnState>) => {
      setBoard((prev) => ({ ...prev, [stage]: { ...prev[stage], ...patch } }));
    },
    [],
  );

  // One request per column. Each response's `total` is that column's header
  // count, so no second aggregation is needed for a number we already have.
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setBoard(
          Object.fromEntries(
            PIPELINE_STAGES.map((stage) => [
              stage,
              { ...EMPTY_COLUMN, status: "error", errorMessage: SESSION_EXPIRED },
            ]),
          ) as BoardState,
        );
        return;
      }

      await Promise.all(
        PIPELINE_STAGES.map(async (stage) => {
          try {
            const response = await fetchCompanies(
              { stage, sort: "updated_desc", page: 1, pageSize: COLUMN_PAGE_SIZE },
              session.access_token,
              controller.signal,
            );
            patchColumn(stage, {
              items: response.items,
              total: response.total,
              pagesLoaded: 1,
              status: "ready",
            });
          } catch (err) {
            if (controller.signal.aborted) return;
            patchColumn(stage, {
              status: "error",
              errorMessage:
                err instanceof Error ? err.message : "Could not load this stage.",
            });
          }
        }),
      );
    }

    load();
    return () => controller.abort();
  }, [supabase, patchColumn]);

  // Cards moving between stages shift the underlying offsets, so a page
  // fetched after a move can repeat a row. De-duplicate rather than refetch.
  async function loadMore(stage: PipelineStage) {
    const column = board[stage];
    if (column.loadingMore) return;

    patchColumn(stage, { loadingMore: true });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      patchColumn(stage, { loadingMore: false, status: "error", errorMessage: SESSION_EXPIRED });
      return;
    }

    try {
      const response = await fetchCompanies(
        {
          stage,
          sort: "updated_desc",
          page: column.pagesLoaded + 1,
          pageSize: COLUMN_PAGE_SIZE,
        },
        session.access_token,
      );
      setBoard((prev) => {
        const current = prev[stage];
        const seen = new Set(current.items.map((item) => item.id));
        const added = response.items.filter((item) => !seen.has(item.id));
        return {
          ...prev,
          [stage]: {
            ...current,
            items: [...current.items, ...added],
            total: response.total,
            pagesLoaded: current.pagesLoaded + 1,
            loadingMore: false,
          },
        };
      });
    } catch (err) {
      patchColumn(stage, {
        loadingMore: false,
        errorMessage: err instanceof Error ? err.message : "Could not load more.",
      });
    }
  }

  // Waits for the backend, then moves the card locally. The row the endpoint
  // returns is what lands, so a stamped `contacted_at` shows up with it.
  async function moveCompany(company: Company, to: PipelineStage) {
    const from = company.stage;
    if (from === to) return;

    setMovingId(company.id);
    setMoveErrors((prev) => {
      const { [company.id]: _removed, ...rest } = prev;
      return rest;
    });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error(SESSION_EXPIRED);

      const updated = await updateCompanyStage(company.id, to, session.access_token);

      setBoard((prev) => {
        const source = prev[from];
        const target = prev[to];
        return {
          ...prev,
          [from]: {
            ...source,
            items: source.items.filter((item) => item.id !== company.id),
            total: Math.max(0, source.total - 1),
          },
          [to]: {
            ...target,
            // Sorted by last-updated, and this row just was.
            items: [updated, ...target.items.filter((item) => item.id !== company.id)],
            total: target.total + 1,
          },
        };
      });
    } catch (err) {
      setMoveErrors((prev) => ({
        ...prev,
        [company.id]: err instanceof Error ? err.message : "Could not move this company.",
      }));
    } finally {
      setMovingId(null);
    }
  }

  return (
    <div className="mt-6 overflow-x-auto pb-32">
      <div className="flex min-w-max gap-4">
        {PIPELINE_STAGES.map((stage) => (
          <PipelineColumn
            key={stage}
            stage={stage}
            column={board[stage]}
            movingId={movingId}
            moveErrors={moveErrors}
            onOpen={(id) => router.push(`/companies/${id}`)}
            onMove={moveCompany}
            onLoadMore={() => loadMore(stage)}
          />
        ))}
      </div>
    </div>
  );
}

function PipelineColumn({
  stage,
  column,
  movingId,
  moveErrors,
  onOpen,
  onMove,
  onLoadMore,
}: {
  stage: PipelineStage;
  column: ColumnState;
  movingId: string | null;
  moveErrors: Record<string, string>;
  onOpen: (id: string) => void;
  onMove: (company: Company, to: PipelineStage) => void;
  onLoadMore: () => void;
}) {
  const hasMore = column.items.length < column.total;

  return (
    <section className="flex w-72 shrink-0 flex-col rounded-md border border-line bg-surface-raised p-3">
      <header className="flex items-center justify-between gap-2 pb-3">
        <StatusBadge stage={stage} />
        <span className="utility-label text-text-secondary" aria-label={`${column.total} companies`}>
          {column.status === "loading" ? "" : column.total}
        </span>
      </header>

      <div className="flex flex-col gap-2">
        {column.status === "loading" ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-md border border-line bg-surface px-4 py-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-20" />
            </div>
          ))
        ) : column.status === "error" ? (
          <EmptyState className="px-1 py-6">{column.errorMessage}</EmptyState>
        ) : column.items.length === 0 ? (
          <EmptyState className="px-1 py-6">Nothing at this stage.</EmptyState>
        ) : (
          column.items.map((company) => (
            <PipelineCard
              key={company.id}
              company={company}
              moving={movingId === company.id}
              errorMessage={moveErrors[company.id]}
              onOpen={() => onOpen(company.id)}
              onMove={(to) => onMove(company, to)}
            />
          ))
        )}
      </div>

      {column.status === "ready" && hasMore ? (
        <Button
          variant="quiet"
          onClick={onLoadMore}
          disabled={column.loadingMore}
          className="mt-2 w-full px-4 py-2 text-sm"
        >
          {column.loadingMore
            ? "Loading..."
            : `Show more (${column.total - column.items.length} left)`}
        </Button>
      ) : null}
    </section>
  );
}

function PipelineCard({
  company,
  moving,
  errorMessage,
  onOpen,
  onMove,
}: {
  company: Company;
  moving: boolean;
  errorMessage?: string;
  onOpen: () => void;
  onMove: (to: PipelineStage) => void;
}) {
  const hiring = describeHiring(company);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-busy={moving}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      className={`cursor-pointer rounded-md border border-line bg-surface px-4 py-3 transition-colors hover:border-signal-teal ${
        moving ? "opacity-60" : ""
      }`}
    >
      <p className="text-sm text-ink">{company.domain}</p>
      <p className={`mt-1 text-xs ${hiring.muted ? "text-text-secondary" : "text-ink"}`}>
        {hiring.label}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2">
        {moving ? (
          <span className="utility-label text-text-secondary">Moving...</span>
        ) : (
          <span />
        )}
        <Menu
          label={`Move ${company.domain} to another stage`}
          trigger="Move"
          disabled={moving}
          items={PIPELINE_STAGES.map((stage) => ({
            key: stage,
            label: <StatusBadge stage={stage} />,
            disabled: stage === company.stage,
            onSelect: () => onMove(stage),
          }))}
        />
      </div>

      {errorMessage ? (
        <p className="mt-2 text-xs text-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
