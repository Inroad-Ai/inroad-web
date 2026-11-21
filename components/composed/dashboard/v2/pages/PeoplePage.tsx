"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { formatRelativeDays, plural } from "@/lib/format";
import { PERSON_ROLE_LABEL, type PersonListItem, type PersonStage } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Notice } from "@/components/ui/Notice";
import { PERSON_STAGES, PERSON_STAGE_LABEL } from "@/components/ui/PersonStageBadge";

import { PeopleLane } from "../../people/PeopleLane";
import { usePeopleBoard } from "../../people/usePeopleBoard";
import { Av, Btn, Ic, Status, Tag, Views } from "../kit";

type StageFilter = PersonStage | "all";
type View = "table" | "board";

const STAGE_TONE: Record<PersonStage, "faint" | "teal" | "amber" | "ochre"> = {
  found: "faint",
  contacted: "teal",
  replied: "amber",
  closed: "ochre",
};

const NEXT_STEP: Record<PersonStage, string> = {
  found: "Send intro",
  contacted: "Follow up",
  replied: "Reply",
  closed: "Closed",
};

const HIGHLIGHTED_ROLES = new Set(["founder", "co_founder", "executive"]);

function Th({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="ci">
      <Ic n={icon} size="xs" />
      {children}
    </span>
  );
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PeoplePage() {
  const router = useRouter();
  const { board, pendingIds, moveErrors, loadMore, movePerson } = usePeopleBoard();
  const [view, setView] = useState<View>("table");
  const [filter, setFilter] = useState<StageFilter>("all");
  // A ref, not state: re-rendering every lane on dragstart would interrupt the drag.
  const dragging = useRef<PersonListItem | null>(null);

  const stages = filter === "all" ? PERSON_STAGES : [filter];
  const rows = stages.flatMap((stage) => board[stage].items);
  const loading = stages.some((stage) => board[stage].status === "loading");
  const errors = Array.from(
    new Set(
      stages
        .filter((stage) => board[stage].status === "error")
        .map((stage) => board[stage].errorMessage),
    ),
  );
  const paged = stages.filter(
    (stage) => board[stage].status === "ready" && board[stage].items.length < board[stage].total,
  );
  const total = PERSON_STAGES.reduce((sum, stage) => sum + board[stage].total, 0);
  const replies = board.replied.total;

  function openPerson(id: string) {
    router.push(`/contacts/${id}`);
  }

  function dropOn(stage: PersonStage) {
    const person = dragging.current;
    dragging.current = null;
    if (person) void movePerson(person, stage);
  }

  return (
    <>
      <div className="row head">
        <div>
          <h1 className="t">People</h1>
          <div className="sub">
            Everyone worth talking to, found across your researched companies.
          </div>
        </div>
        <span className="sp" />
        <Btn icon="search" href="/research">
          Find more people
        </Btn>
      </div>

      <div className="row wrap" style={{ marginTop: 22, gap: 0 }}>
        <Views
          className="grow"
          items={[
            { l: "Everyone", n: total, on: filter === "all", onSelect: () => setFilter("all") },
            ...PERSON_STAGES.map((stage) => ({
              l: PERSON_STAGE_LABEL[stage],
              n: board[stage].total,
              on: filter === stage,
              onSelect: () => setFilter(stage),
            })),
          ]}
        />
        <span className="row" style={{ gap: 4, paddingLeft: 14 }}>
          <button
            type="button"
            className={`btn t sm ${view === "table" ? "" : "faint"}`}
            aria-pressed={view === "table"}
            onClick={() => setView("table")}
          >
            <Ic n="layers" size="s" /> Table
          </button>
          <button
            type="button"
            className={`btn t sm ${view === "board" ? "" : "faint"}`}
            aria-pressed={view === "board"}
            onClick={() => setView("board")}
          >
            <Ic n="kanban" size="s" /> Board
          </button>
        </span>
      </div>

      <div className="row wrap" style={{ gap: 18, margin: "12px 0 4px" }}>
        <span className="sm muted">
          {view === "board"
            ? "Drag a person to a new stage, or use Move."
            : plural(rows.length, "person", "people")}
        </span>
        <span className="sp" />
        {replies > 0 ? (
          <span className="sm">
            <b className="amber">{plural(replies, "reply", "replies")}</b>{" "}
            <span className="muted">waiting.</span>
          </span>
        ) : null}
      </div>

      {errors.map((message) => (
        <Notice key={message}>{message}</Notice>
      ))}

      {view === "table" ? (
        <>
          <div className="tablewrap">
            <table className="t">
              <thead>
                <tr>
                  <th style={{ width: 260 }}>
                    <Th icon="user">Person</Th>
                  </th>
                  <th>
                    <Th icon="building">Company</Th>
                  </th>
                  <th>
                    <Th icon="tag">Role</Th>
                  </th>
                  <th>
                    <Th icon="flag">Status</Th>
                  </th>
                  <th>
                    <Th icon="mail">Email</Th>
                  </th>
                  <th>
                    <Th icon="clock">Contacted</Th>
                  </th>
                  <th>
                    <Th icon="arrow">Next</Th>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((person) => (
                  <tr key={person.id}>
                    <td>
                      <Link href={`/contacts/${person.id}`} className="row">
                        <Av
                          i={initialsOf(person.name)}
                          c={(person.name.length % 6) + 1}
                          size="xs"
                        />
                        <div>
                          <span className="m">{person.name}</span>{" "}
                          {person.title ? <span className="faint xs">{person.title}</span> : null}
                        </div>
                      </Link>
                    </td>
                    <td className="muted">{person.company_domain}</td>
                    <td>
                      <Tag tone={HIGHLIGHTED_ROLES.has(person.role_category) ? "amber" : ""}>
                        {PERSON_ROLE_LABEL[person.role_category]}
                      </Tag>
                    </td>
                    <td>
                      <Status tone={STAGE_TONE[person.stage]}>
                        {PERSON_STAGE_LABEL[person.stage]}
                      </Status>
                    </td>
                    <td>
                      {person.email ? (
                        <span>{person.email}</span>
                      ) : (
                        <span className="faint">Not found</span>
                      )}
                    </td>
                    <td className="muted">
                      {person.contacted_at ? formatRelativeDays(person.contacted_at) : "Not yet"}
                    </td>
                    <td className={person.stage === "replied" ? "amber m" : "muted"}>
                      {NEXT_STEP[person.stage]}
                    </td>
                  </tr>
                ))}
                {loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="faint">
                      Loading...
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          {!loading && rows.length === 0 && errors.length === 0 ? (
            <EmptyState className="px-6 py-12 text-center">Nobody at this stage.</EmptyState>
          ) : null}
          {paged.length > 0 ? (
            <div className="row wrap" style={{ gap: 8, marginTop: 14 }}>
              {paged.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  className="btn sm"
                  disabled={board[stage].loadingMore}
                  onClick={() => loadMore(stage)}
                >
                  {board[stage].loadingMore
                    ? "Loading..."
                    : `Show more ${PERSON_STAGE_LABEL[stage]} (${board[stage].total - board[stage].items.length} left)`}
                </button>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <div className="-mx-1 snap-x overflow-x-auto px-1 pb-32" style={{ marginTop: 14 }}>
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
      )}
    </>
  );
}
