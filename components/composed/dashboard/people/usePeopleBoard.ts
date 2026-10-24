"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchPeople, updatePersonStage } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { PERSON_STAGES, type PersonListItem, type PersonStage } from "@/lib/types";

import { emptyLane, type LaneState } from "../lane-state";

// Columns are never unbounded: a company can turn up several people per
// run, so each stage pages on demand, same reasoning as PipelineBoard.
const COLUMN_PAGE_SIZE = 20;

const SESSION_EXPIRED = "Your session expired. Sign in again to see your contacts.";

export type ColumnState = LaneState<PersonListItem>;

export type BoardState = Record<PersonStage, ColumnState>;

const EMPTY_COLUMN: ColumnState = emptyLane();

function boardOf(column: ColumnState): BoardState {
  return Object.fromEntries(PERSON_STAGES.map((stage) => [stage, { ...column }])) as BoardState;
}

function withoutPerson(column: ColumnState, id: string): ColumnState {
  return {
    ...column,
    items: column.items.filter((item) => item.id !== id),
    total: Math.max(0, column.total - 1),
  };
}

function withPersonAt(column: ColumnState, person: PersonListItem, index: number): ColumnState {
  const items = column.items.filter((item) => item.id !== person.id);
  items.splice(index, 0, person);
  return { ...column, items, total: column.total + 1 };
}

export interface PeopleBoard {
  board: BoardState;
  pendingIds: ReadonlySet<string>;
  moveErrors: Record<string, string>;
  loadMore: (stage: PersonStage) => Promise<void>;
  movePerson: (person: PersonListItem, to: PersonStage) => Promise<void>;
}

export function usePeopleBoard(): PeopleBoard {
  const [board, setBoard] = useState<BoardState>(() => boardOf(EMPTY_COLUMN));
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(new Set());
  const [moveErrors, setMoveErrors] = useState<Record<string, string>>({});

  const patchColumn = useCallback((stage: PersonStage, patch: Partial<ColumnState>) => {
    setBoard((prev) => ({ ...prev, [stage]: { ...prev[stage], ...patch } }));
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const token = await ensureValidAccessToken();
      if (!token) {
        setBoard(boardOf({ ...EMPTY_COLUMN, status: "error", errorMessage: SESSION_EXPIRED }));
        return;
      }

      await Promise.all(
        PERSON_STAGES.map(async (stage) => {
          try {
            const response = await fetchPeople(
              { stage, page: 1, pageSize: COLUMN_PAGE_SIZE },
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

  async function loadMore(stage: PersonStage) {
    const column = board[stage];
    if (column.loadingMore) return;

    patchColumn(stage, { loadingMore: true });
    const token = await ensureValidAccessToken();
    if (!token) {
      patchColumn(stage, { loadingMore: false, status: "error", errorMessage: SESSION_EXPIRED });
      return;
    }

    try {
      const response = await fetchPeople(
        { stage, page: column.pagesLoaded + 1, pageSize: COLUMN_PAGE_SIZE },
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

  function setPending(id: string, isPending: boolean) {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (isPending) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  /** Optimistic: the card lands in its new lane straight away and goes back
   * to its old position if the server refuses the move. */
  async function movePerson(person: PersonListItem, to: PersonStage) {
    const from = person.stage;
    if (from === to || pendingIds.has(person.id)) return;

    const originalIndex = board[from].items.findIndex((item) => item.id === person.id);
    setPending(person.id, true);
    setMoveErrors((prev) => {
      const { [person.id]: _removed, ...rest } = prev;
      return rest;
    });
    setBoard((prev) => ({
      ...prev,
      [from]: withoutPerson(prev[from], person.id),
      [to]: withPersonAt(prev[to], { ...person, stage: to }, 0),
    }));

    try {
      const token = await ensureValidAccessToken();
      if (!token) throw new Error(SESSION_EXPIRED);

      const updated = await updatePersonStage(person.id, to, token);
      const movedItem: PersonListItem = { ...updated, company_domain: person.company_domain };
      setBoard((prev) => ({
        ...prev,
        [to]: {
          ...prev[to],
          items: prev[to].items.map((item) => (item.id === person.id ? movedItem : item)),
        },
      }));
    } catch (err) {
      setBoard((prev) => ({
        ...prev,
        [to]: withoutPerson(prev[to], person.id),
        [from]: withPersonAt(prev[from], person, Math.max(0, originalIndex)),
      }));
      setMoveErrors((prev) => ({
        ...prev,
        [person.id]: err instanceof Error ? err.message : "Could not move this person.",
      }));
    } finally {
      setPending(person.id, false);
    }
  }

  return { board, pendingIds, moveErrors, loadMore, movePerson };
}
