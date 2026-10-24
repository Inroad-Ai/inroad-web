"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { PersonListItem, PersonStage } from "@/lib/types";
import { BoardIcon, ListIcon } from "@/components/ui/Icons";
import { PERSON_STAGES } from "@/components/ui/PersonStageBadge";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { PeopleLane } from "./people/PeopleLane";
import { PeopleTable } from "./people/PeopleTable";
import { usePeopleBoard } from "./people/usePeopleBoard";

type View = "board" | "list";

const VIEW_TABS: TabItem[] = [
  { id: "board", label: "Board", icon: BoardIcon },
  { id: "list", label: "List", icon: ListIcon },
];

export function ContactsBoard() {
  const router = useRouter();
  const { board, pendingIds, moveErrors, loadMore, movePerson } = usePeopleBoard();
  const [view, setView] = useState<View>("board");
  // A ref, not state: the drop handler only needs whoever is in flight, and
  // re-rendering every lane on dragstart would interrupt the browser's drag.
  const dragging = useRef<PersonListItem | null>(null);

  function openPerson(id: string) {
    router.push(`/contacts/${id}`);
  }

  function dropOn(stage: PersonStage) {
    const person = dragging.current;
    dragging.current = null;
    if (person) void movePerson(person, stage);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs items={VIEW_TABS} activeId={view} onChange={(id) => setView(id as View)} />
        {view === "board" ? (
          <p className="text-xs text-ink-muted">Drag a person to a new stage, or use Move.</p>
        ) : null}
      </div>

      {view === "board" ? (
        <div className="-mx-1 snap-x overflow-x-auto px-1 pb-32">
          <div className="flex min-w-max gap-4">
            {PERSON_STAGES.map((stage) => (
              <PeopleLane
                key={stage}
                stage={stage}
                column={board[stage]}
                pendingIds={pendingIds}
                moveErrors={moveErrors}
                onOpen={openPerson}
                onMove={movePerson}
                onDropPerson={dropOn}
                onDragPerson={(person) => {
                  dragging.current = person;
                }}
                onLoadMore={() => loadMore(stage)}
              />
            ))}
          </div>
        </div>
      ) : (
        <PeopleTable board={board} onOpen={openPerson} onLoadMore={loadMore} />
      )}
    </div>
  );
}
