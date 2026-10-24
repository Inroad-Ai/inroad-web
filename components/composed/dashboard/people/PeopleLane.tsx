"use client";

import { useState, type DragEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { PersonListItem, PersonStage } from "@/lib/types";
import { PERSON_STAGE_LABEL, PersonStageBadge } from "@/components/ui/PersonStageBadge";

import { BoardLane } from "../BoardLane";
import { PERSON_DRAG_TYPE, PersonCard } from "./PersonCard";
import type { ColumnState } from "./usePeopleBoard";

export function PeopleLane({
  stage,
  column,
  pendingIds,
  moveErrors,
  onOpen,
  onMove,
  onDropPerson,
  onDragPerson,
  onLoadMore,
}: {
  stage: PersonStage;
  column: ColumnState;
  pendingIds: ReadonlySet<string>;
  moveErrors: Record<string, string>;
  onOpen: (id: string) => void;
  onMove: (person: PersonListItem, to: PersonStage) => void;
  onDropPerson: (to: PersonStage) => void;
  onDragPerson: (person: PersonListItem | null) => void;
  onLoadMore: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [isOver, setIsOver] = useState(false);

  function isPersonDrag(event: DragEvent<HTMLElement>) {
    return event.dataTransfer.types.includes(PERSON_DRAG_TYPE);
  }

  return (
    <BoardLane
      label={`${PERSON_STAGE_LABEL[stage]} people`}
      badge={<PersonStageBadge stage={stage} />}
      lane={column}
      isOver={isOver}
      emptyText="Nobody at this stage."
      onLoadMore={onLoadMore}
      onDragOver={(event) => {
        if (!isPersonDrag(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setIsOver(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOver(false);
      }}
      onDrop={(event) => {
        if (!isPersonDrag(event)) return;
        event.preventDefault();
        setIsOver(false);
        onDropPerson(stage);
      }}
    >
      <ul className="flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {column.items.map((person) => (
            <motion.li
              key={person.id}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
            >
              <PersonCard
                person={person}
                isMoving={pendingIds.has(person.id)}
                errorMessage={moveErrors[person.id]}
                onOpen={() => onOpen(person.id)}
                onMove={(to) => onMove(person, to)}
                onDragStart={() => onDragPerson(person)}
                onDragEnd={() => onDragPerson(null)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </BoardLane>
  );
}
