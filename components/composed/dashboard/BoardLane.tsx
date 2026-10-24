import type { DragEventHandler, ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Notice } from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/Skeleton";

import type { LaneState } from "./lane-state";

const SKELETON_CARDS = 3;

/** A board column: stage badge and count, then its cards, an empty or error
 * line, and Show more. Lights up while a card is dragged over it. */
export function BoardLane<T>({
  label,
  badge,
  lane,
  isOver,
  emptyText,
  onLoadMore,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: {
  label: string;
  badge: ReactNode;
  lane: LaneState<T>;
  isOver: boolean;
  emptyText: string;
  onLoadMore: () => void;
  onDragOver: DragEventHandler<HTMLElement>;
  onDragLeave: DragEventHandler<HTMLElement>;
  onDrop: DragEventHandler<HTMLElement>;
  children: ReactNode;
}) {
  const isLoading = lane.status === "loading";
  const remaining = lane.total - lane.items.length;

  return (
    <section
      aria-label={isLoading ? label : `${label}, ${lane.total}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex min-h-96 w-72 shrink-0 snap-start flex-col gap-2.5 rounded-card p-3 transition duration-fast ease-standard ${
        isOver ? "bg-signal-amber-subtle ring-2 ring-inset ring-signal-amber" : "bg-lane"
      }`}
    >
      <header className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-1">
        {badge}
        <span className="utility-label text-ink-muted" aria-hidden>
          {isLoading ? "" : lane.total}
        </span>
      </header>

      {isLoading ? (
        Array.from({ length: SKELETON_CARDS }).map((_, i) => (
          <Card key={i} padding="sm" aria-hidden>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-20" />
          </Card>
        ))
      ) : lane.status === "error" ? (
        <EmptyState className="px-1.5 py-6">{lane.errorMessage}</EmptyState>
      ) : lane.items.length === 0 ? (
        <div className="flex flex-1 items-start justify-center rounded-nest border border-dashed border-line px-3 py-8">
          <EmptyState className="text-center">{emptyText}</EmptyState>
        </div>
      ) : (
        children
      )}

      {lane.status === "ready" && lane.errorMessage ? (
        <Notice size="xs" className="px-1.5">
          {lane.errorMessage}
        </Notice>
      ) : null}

      {lane.status === "ready" && remaining > 0 ? (
        <Button
          variant="quiet"
          size="sm"
          onClick={onLoadMore}
          disabled={lane.loadingMore}
          className="mt-auto w-full"
        >
          {lane.loadingMore ? "Loading..." : `Show more (${remaining} left)`}
        </Button>
      ) : null}
    </section>
  );
}
