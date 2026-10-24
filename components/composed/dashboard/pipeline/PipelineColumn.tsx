"use client";

import { useEffect, useState, type DragEvent } from "react";

import type { Company } from "@/lib/types";
import { STAGE_LABEL, StatusBadge, type PipelineStage } from "@/components/ui/StatusBadge";

import { BoardLane } from "../BoardLane";
import type { ColumnState } from "./board-state";
import { PipelineCard } from "./PipelineCard";

export function PipelineColumn({
  stage,
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

  return (
    <BoardLane
      label={`${STAGE_LABEL[stage]} companies`}
      badge={<StatusBadge stage={stage} />}
      lane={column}
      isOver={over}
      emptyText={acceptsDrop ? "Drop here to move it to this stage." : "Nothing at this stage."}
      onLoadMore={onLoadMore}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ul className="flex flex-col gap-2.5">
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
    </BoardLane>
  );
}
