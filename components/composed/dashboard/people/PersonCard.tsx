"use client";

import type { DragEvent } from "react";

import { PERSON_ROLE_LABEL, type PersonListItem, type PersonStage } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { PersonStageMenu } from "./PersonStageMenu";

export const PERSON_DRAG_TYPE = "application/x-inroad-person";

export function PersonCard({
  person,
  isMoving,
  errorMessage,
  onOpen,
  onMove,
  onDragStart,
  onDragEnd,
}: {
  person: PersonListItem;
  isMoving: boolean;
  errorMessage?: string;
  onOpen: () => void;
  onMove: (to: PersonStage) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  function handleDragStart(event: DragEvent<HTMLElement>) {
    event.dataTransfer.setData(PERSON_DRAG_TYPE, person.id);
    event.dataTransfer.effectAllowed = "move";
    onDragStart();
  }

  return (
    <Card
      variant="interactive"
      padding="sm"
      role="button"
      tabIndex={0}
      draggable={!isMoving}
      aria-busy={isMoving}
      aria-label={`Open ${person.name}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen();
      }}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`cursor-grab active:cursor-grabbing ${isMoving ? "opacity-60" : ""}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={person.name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-sans-semibold text-ink">{person.name}</p>
          <p className="truncate text-xs text-ink-muted">{person.company_domain}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {isMoving ? (
          <span className="utility-label text-ink-muted">Moving...</span>
        ) : (
          <Badge tone="neutral">{PERSON_ROLE_LABEL[person.role_category]}</Badge>
        )}
        <PersonStageMenu
          name={person.name}
          stage={person.stage}
          disabled={isMoving}
          onMove={onMove}
        />
      </div>

      {errorMessage ? (
        <Notice size="xs" className="mt-2">
          {errorMessage}
        </Notice>
      ) : null}
    </Card>
  );
}
