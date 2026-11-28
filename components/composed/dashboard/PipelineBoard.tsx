"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { fetchCompanies, updateCompanyStage } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import type { Company } from "@/lib/types";
import { PIPELINE_STAGES, type PipelineStage } from "@/components/ui/StatusBadge";

import {
  boardOf,
  EMPTY_COLUMN,
  moveCard,
  replaceCard,
  rollbackCard,
  type BoardState,
  type ColumnState,
} from "./pipeline/board-state";
import { PipelineColumn } from "./pipeline/PipelineColumn";
import { isQuiet } from "./v2/next-step";

// Columns are never unbounded: some stages will hold hundreds of companies
// after the historical import, so each pages on demand.
const COLUMN_PAGE_SIZE = 20;

const SESSION_EXPIRED = "Your session expired. Sign in again to see your pipeline.";

// The five columns of the design. Rejected companies are counted under the board.
const BOARD_COLUMNS: { stage: PipelineStage; title: string; dot: string }[] = [
  { stage: "researched", title: "Researched", dot: "ink-faint" },
  { stage: "contacted", title: "Contacted", dot: "signal-teal" },
  { stage: "responded", title: "Replied", dot: "signal-amber" },
  { stage: "interviewing", title: "Interviewing", dot: "success" },
  { stage: "closed", title: "Offer", dot: "warning" },
];

function emptyNoteFor(stage: PipelineStage, interviews: number): string {
  if (stage !== "closed") return "Nothing at this stage.";
  if (interviews === 0) return "Your first offer lands here.";
  return `Your first offer lands here. ${interviews} ${interviews === 1 ? "interview is" : "interviews are"} open.`;
}

export function PipelineBoard({ onQuietChange }: { onQuietChange?: (count: number) => void }) {
  const router = useRouter();

  const [board, setBoard] = useState<BoardState>(() => boardOf(EMPTY_COLUMN));
  const [movingIds, setMovingIds] = useState<ReadonlySet<string>>(() => new Set());
  const [moveErrors, setMoveErrors] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<Company | null>(null);

  const patchColumn = useCallback((stage: PipelineStage, patch: Partial<ColumnState>) => {
    setBoard((prev) => ({ ...prev, [stage]: { ...prev[stage], ...patch } }));
  }, []);

  // One request per column. Each response's `total` is that column's header
  // count, so no second aggregation is needed for a number we already have.
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const token = await ensureValidAccessToken();
      if (!token) {
        setBoard(boardOf({ ...EMPTY_COLUMN, status: "error", errorMessage: SESSION_EXPIRED }));
        return;
      }

      await Promise.all(
        PIPELINE_STAGES.map(async (stage) => {
          try {
            const response = await fetchCompanies(
              { stage, sort: "updated_desc", page: 1, pageSize: COLUMN_PAGE_SIZE },
              token,
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
              errorMessage: err instanceof Error ? err.message : "Could not load this stage.",
            });
          }
        }),
      );
    }

    load();
    return () => controller.abort();
  }, [patchColumn]);

  // Cards moving between stages shift the underlying offsets, so a page
  // fetched after a move can repeat a row. De-duplicate rather than refetch.
  async function loadMore(stage: PipelineStage) {
    const column = board[stage];
    if (column.loadingMore) return;

    patchColumn(stage, { loadingMore: true, errorMessage: "" });
    const token = await ensureValidAccessToken();
    if (!token) {
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
        token,
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

  function setMoving(id: string, moving: boolean) {
    setMovingIds((prev) => {
      const next = new Set(prev);
      if (moving) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  // Moves the card at once, then swaps in the row the endpoint returns (so a
  // stamped `contacted_at` lands with it). A failed PATCH puts it back.
  async function moveCompany(company: Company, to: PipelineStage) {
    const from = company.stage;
    if (from === to || movingIds.has(company.id)) return;

    const index = board[from].items.findIndex((item) => item.id === company.id);
    setMoving(company.id, true);
    setMoveErrors((prev) => {
      const { [company.id]: _removed, ...rest } = prev;
      return rest;
    });
    setBoard((prev) => moveCard(prev, company, from, to, { ...company, stage: to }));

    try {
      const token = await ensureValidAccessToken();
      if (!token) throw new Error(SESSION_EXPIRED);

      const updated = await updateCompanyStage(company.id, to, token);
      setBoard((prev) => replaceCard(prev, to, updated));
    } catch (err) {
      setBoard((prev) => rollbackCard(prev, company, from, to, Math.max(0, index)));
      setMoveErrors((prev) => ({
        ...prev,
        [company.id]: err instanceof Error ? err.message : "Could not move this company.",
      }));
    } finally {
      setMoving(company.id, false);
    }
  }

  const quietCount = board.contacted.items.filter(isQuiet).length;
  useEffect(() => {
    onQuietChange?.(quietCount);
  }, [quietCount, onQuietChange]);

  function dropOn(to: PipelineStage) {
    if (dragging) moveCompany(dragging, to);
    setDragging(null);
  }

  const rejected = board.rejected;

  return (
    <motion.div layoutScroll className="stage-scroll">
      <LayoutGroup>
        <div className="stage-board">
          {BOARD_COLUMNS.map(({ stage, title, dot }) => (
            <PipelineColumn
              key={stage}
              stage={stage}
              title={title}
              dot={dot}
              emptyNote={emptyNoteFor(stage, board.interviewing.total)}
              column={board[stage]}
              movingIds={movingIds}
              moveErrors={moveErrors}
              draggingId={dragging?.id ?? null}
              acceptsDrop={
                dragging !== null && dragging.stage !== stage && board[stage].status === "ready"
              }
              onOpen={(id) => router.push(`/companies/${id}`)}
              onMove={moveCompany}
              onDragStart={setDragging}
              onDragEnd={() => setDragging(null)}
              onDrop={dropOn}
              onLoadMore={() => loadMore(stage)}
            />
          ))}
        </div>
      </LayoutGroup>
      {rejected.status === "ready" && rejected.total > 0 ? (
        <p className="sm faint" style={{ marginTop: 22 }}>
          {rejected.total} rejected.{" "}
          <Link href="/companies" className="muted">
            See them in Companies
          </Link>
        </p>
      ) : null}
    </motion.div>
  );
}
