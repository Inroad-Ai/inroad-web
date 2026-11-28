"use client";

import { useEffect, useState, type DragEvent } from "react";

import type { Company } from "@/lib/types";
import { Notice } from "@/components/ui/Notice";
import type { PipelineStage } from "@/components/ui/StatusBadge";

import type { ColumnState } from "./board-state";
import { PipelineCard } from "./PipelineCard";

export function PipelineColumn({
  stage,
  title,
  dot,
  emptyNote,
  column,
  movingIds,
  moveErrors,
  draggingId,
  acceptsDrop,
  onOpen,
  onMove,
  onDragStart,
  onDragEnd,
  onDrop,
  onLoadMore,
}: {
  stage: PipelineStage;
  title: string;
  /** Colour token name for the dot beside the title. */
  dot: string;
  emptyNote: string;
  column: ColumnState;
  movingIds: ReadonlySet<string>;
  moveErrors: Record<string, string>;
  draggingId: string | null;
  /** A card from another stage is being dragged, so this lane is a target. */
  acceptsDrop: boolean;
  onOpen: (id: string) => void;
  onMove: (company: Company, to: PipelineStage) => void;
  onDragStart: (company: Company) => void;
  onDragEnd: () => void;
  onDrop: (to: PipelineStage) => void;
  onLoadMore: () => void;
}) {
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (!acceptsDrop) setOver(false);
  }, [acceptsDrop]);

  function handleDragOver(event: DragEvent<HTMLElement>) {
    if (!acceptsDrop) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setOver(true);
  }

  function handleDragLeave(event: DragEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(false);
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setOver(false);
    if (acceptsDrop) onDrop(stage);
  }

  const remaining = column.total - column.items.length;

  return (
    <section
      className={`stage-col ${over ? "over" : ""}`}
      aria-label={
        column.status === "loading" ? `${title} companies` : `${title} companies, ${column.total}`
      }
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="row" style={{ marginBottom: 12, padding: "0 2px" }}>
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: `rgb(var(--color-${dot}))`,
          }}
        />
        <h2 className="m sm">{title}</h2>
        <span className="faint sm">{column.status === "loading" ? "" : column.total}</span>
      </div>

      {column.status === "loading" ? (
        <p className="sm faint">Loading...</p>
      ) : column.status === "error" ? (
        <p className="sm rose">{column.errorMessage}</p>
      ) : column.items.length === 0 ? (
        <p className="sm faint" style={{ lineHeight: 1.6, padding: "6px 2px" }}>
          {acceptsDrop ? "Drop here to move it to this stage." : emptyNote}
        </p>
      ) : (
        <ul className="col" style={{ gap: 10, listStyle: "none" }}>
          {column.items.map((company) => (
            <PipelineCard
              key={company.id}
              company={company}
              moving={movingIds.has(company.id)}
              dragging={draggingId === company.id}
              errorMessage={moveErrors[company.id]}
              onOpen={() => onOpen(company.id)}
              onMove={(to) => onMove(company, to)}
              onDragStart={() => onDragStart(company)}
              onDragEnd={onDragEnd}
            />
          ))}
        </ul>
      )}

      {column.status === "ready" && column.errorMessage ? (
        <Notice size="xs">{column.errorMessage}</Notice>
      ) : null}
      {column.status === "ready" && remaining > 0 ? (
        <button
          type="button"
          className="xs faint"
          style={{ padding: "10px 2px" }}
          onClick={onLoadMore}
          disabled={column.loadingMore}
        >
          {column.loadingMore ? "Loading..." : `${remaining} more`}
        </button>
      ) : null}
    </section>
  );
}
