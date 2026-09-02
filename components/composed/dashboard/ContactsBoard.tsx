"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchPeople, updatePersonStage } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { PERSON_ROLE_LABEL, type PersonListItem } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Menu } from "@/components/ui/Menu";
import {
  PERSON_STAGES,
  PersonStageBadge,
  type PersonStage,
} from "@/components/ui/PersonStageBadge";
import { Skeleton } from "@/components/ui/Skeleton";

// Columns are never unbounded: a company can turn up several people per
// run, so each stage pages on demand, same reasoning as PipelineBoard.
const COLUMN_PAGE_SIZE = 20;

interface ColumnState {
  items: PersonListItem[];
  total: number;
  pagesLoaded: number;
  status: "loading" | "error" | "ready";
  loadingMore: boolean;
  errorMessage: string;
}

type BoardState = Record<PersonStage, ColumnState>;

const EMPTY_COLUMN: ColumnState = {
  items: [],
  total: 0,
  pagesLoaded: 0,
  status: "loading",
  loadingMore: false,
  errorMessage: "",
};

function initialBoard(): BoardState {
  return Object.fromEntries(PERSON_STAGES.map((stage) => [stage, { ...EMPTY_COLUMN }])) as BoardState;
}

const SESSION_EXPIRED = "Your session expired. Sign in again to see your contacts.";

export function ContactsBoard() {
  const router = useRouter();

  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [moveErrors, setMoveErrors] = useState<Record<string, string>>({});

  const patchColumn = useCallback((stage: PersonStage, patch: Partial<ColumnState>) => {
    setBoard((prev) => ({ ...prev, [stage]: { ...prev[stage], ...patch } }));
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const token = await ensureValidAccessToken();
      if (!token) {
        setBoard(
          Object.fromEntries(
            PERSON_STAGES.map((stage) => [
              stage,
              { ...EMPTY_COLUMN, status: "error", errorMessage: SESSION_EXPIRED },
            ]),
          ) as BoardState,
        );
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

  async function movePerson(person: PersonListItem, to: PersonStage) {
    const from = person.stage;
    if (from === to) return;

    setMovingId(person.id);
    setMoveErrors((prev) => {
      const { [person.id]: _removed, ...rest } = prev;
      return rest;
    });

    try {
      const token = await ensureValidAccessToken();
      if (!token) throw new Error(SESSION_EXPIRED);

      const updated = await updatePersonStage(person.id, to, token);
      const movedItem: PersonListItem = { ...updated, company_domain: person.company_domain };

      setBoard((prev) => {
        const source = prev[from];
        const target = prev[to];
        return {
          ...prev,
          [from]: {
            ...source,
            items: source.items.filter((item) => item.id !== person.id),
            total: Math.max(0, source.total - 1),
          },
          [to]: {
            ...target,
            items: [movedItem, ...target.items.filter((item) => item.id !== person.id)],
            total: target.total + 1,
          },
        };
      });
    } catch (err) {
      setMoveErrors((prev) => ({
        ...prev,
        [person.id]: err instanceof Error ? err.message : "Could not move this person.",
      }));
    } finally {
      setMovingId(null);
    }
  }

  return (
    <div className="mt-6 overflow-x-auto pb-32">
      <div className="flex min-w-max gap-4">
        {PERSON_STAGES.map((stage) => (
          <ContactsColumn
            key={stage}
            stage={stage}
            column={board[stage]}
            movingId={movingId}
            moveErrors={moveErrors}
            onOpen={(id) => router.push(`/contacts/${id}`)}
            onMove={movePerson}
            onLoadMore={() => loadMore(stage)}
          />
        ))}
      </div>
    </div>
  );
}

function ContactsColumn({
  stage,
  column,
  movingId,
  moveErrors,
  onOpen,
  onMove,
  onLoadMore,
}: {
  stage: PersonStage;
  column: ColumnState;
  movingId: string | null;
  moveErrors: Record<string, string>;
  onOpen: (id: string) => void;
  onMove: (person: PersonListItem, to: PersonStage) => void;
  onLoadMore: () => void;
}) {
  const hasMore = column.items.length < column.total;

  return (
    <section className="flex w-72 shrink-0 flex-col rounded-md border border-line bg-surface-raised p-3">
      <header className="flex items-center justify-between gap-2 pb-3">
        <PersonStageBadge stage={stage} />
        <span className="utility-label text-text-secondary" aria-label={`${column.total} people`}>
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
          <EmptyState className="px-1 py-6">Nobody at this stage.</EmptyState>
        ) : (
          column.items.map((person) => (
            <ContactCard
              key={person.id}
              person={person}
              moving={movingId === person.id}
              errorMessage={moveErrors[person.id]}
              onOpen={() => onOpen(person.id)}
              onMove={(to) => onMove(person, to)}
            />
          ))
        )}
      </div>

      {column.status === "ready" && hasMore ? (
        <Button
          variant="quiet"
          size="sm"
          onClick={onLoadMore}
          disabled={column.loadingMore}
          className="mt-2 w-full"
        >
          {column.loadingMore ? "Loading..." : `Show more (${column.total - column.items.length} left)`}
        </Button>
      ) : null}
    </section>
  );
}

function ContactCard({
  person,
  moving,
  errorMessage,
  onOpen,
  onMove,
}: {
  person: PersonListItem;
  moving: boolean;
  errorMessage?: string;
  onOpen: () => void;
  onMove: (to: PersonStage) => void;
}) {
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
      <p className="text-sm text-ink">{person.name}</p>
      <p className="mt-1 text-xs text-text-secondary">{person.company_domain}</p>
      <div className="mt-2">
        <Badge tone="neutral">{PERSON_ROLE_LABEL[person.role_category]}</Badge>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {moving ? <span className="utility-label text-text-secondary">Moving...</span> : <span />}
        <Menu
          label={`Move ${person.name} to another stage`}
          trigger="Move"
          disabled={moving}
          items={PERSON_STAGES.map((stage) => ({
            key: stage,
            label: <PersonStageBadge stage={stage} />,
            disabled: stage === person.stage,
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
