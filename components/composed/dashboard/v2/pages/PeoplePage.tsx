"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { formatRelativeDays, plural } from "@/lib/format";
import { PERSON_ROLE_LABEL, type PersonListItem, type PersonStage } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Notice } from "@/components/ui/Notice";
import { PERSON_STAGES, PERSON_STAGE_LABEL } from "@/components/ui/PersonStageBadge";

import { PeopleLane } from "../../people/PeopleLane";
import { usePeopleBoard } from "../../people/usePeopleBoard";
import { Av, Btn, Ic, Status, Tag, Views, Warmth } from "../kit";
import { samplePath, sampleWarmth } from "../sample";

type StageFilter = PersonStage | "all";
type View = "table" | "board";
type ListId = "everyone" | "managers" | "founders" | "recruiters" | "maintainers" | "warm" | string;

interface CustomList {
  id: string;
  name: string;
  stage: StageFilter;
}

interface DraftPerson {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
}

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

function inList(person: PersonListItem, list: ListId): boolean {
  switch (list) {
    case "managers":
      return (
        person.role_category === "executive" || /manager|head|director|vp/i.test(person.title ?? "")
      );
    case "founders":
      return person.role_category === "founder" || person.role_category === "co_founder";
    case "recruiters":
      return person.role_category === "recruiter" || person.role_category === "hr";
    case "maintainers":
      return /maintainer|open.?source/i.test(person.title ?? "");
    case "warm":
      return sampleWarmth(person.id) === 3;
    default:
      return true;
  }
}

export function PeoplePage() {
  const router = useRouter();
  const { board, pendingIds, moveErrors, loadMore, movePerson } = usePeopleBoard();
  const [view, setView] = useState<View>("table");
  const [filter, setFilter] = useState<StageFilter>("all");
  const [list, setList] = useState<ListId>("everyone");
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  const [namingList, setNamingList] = useState(false);
  const [listName, setListName] = useState("");
  const [adding, setAdding] = useState(false);
  const [drafts, setDrafts] = useState<DraftPerson[]>([]);
  // A ref, not state: re-rendering every lane on dragstart would interrupt the drag.
  const dragging = useRef<PersonListItem | null>(null);

  const stages = filter === "all" ? PERSON_STAGES : [filter];
  const stageRows = stages.flatMap((stage) => board[stage].items);
  const rows = stageRows.filter((person) => inList(person, list));
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
  const everyone = PERSON_STAGES.flatMap((stage) => board[stage].items);
  const warmUnused = everyone.filter((p) => sampleWarmth(p.id) === 3 && p.stage === "found").length;

  function openPerson(id: string) {
    router.push(`/contacts/${id}`);
  }

  function dropOn(stage: PersonStage) {
    const person = dragging.current;
    dragging.current = null;
    if (person) void movePerson(person, stage);
  }

  function applyList(id: ListId) {
    setList(id);
    const custom = customLists.find((entry) => entry.id === id);
    if (custom) setFilter(custom.stage);
  }

  function saveList() {
    const name = listName.trim();
    if (!name) return;
    const id = `list-${Date.now()}`;
    setCustomLists((current) => [...current, { id, name, stage: filter }]);
    setList(id);
    setListName("");
    setNamingList(false);
  }

  function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;
    setDrafts((current) => [
      {
        id: `draft-${Date.now()}`,
        name,
        company: String(data.get("company") ?? "").trim(),
        title: String(data.get("title") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
      },
      ...current,
    ]);
    event.currentTarget.reset();
    setAdding(false);
  }

  const counts: Record<string, number> = {
    managers: everyone.filter((p) => inList(p, "managers")).length,
    founders: everyone.filter((p) => inList(p, "founders")).length,
    recruiters: everyone.filter((p) => inList(p, "recruiters")).length,
    maintainers: everyone.filter((p) => inList(p, "maintainers")).length,
    warm: everyone.filter((p) => inList(p, "warm")).length,
  };

  return (
    <>
      <div className="row head">
        <div>
          <h1 className="t">People</h1>
          <div className="sub">Everyone worth talking to, with the warmest path in.</div>
        </div>
        <span className="sp" />
        <Btn icon="search" href="/research">
          Find more people
        </Btn>
        <Btn kind="p" icon="plus" onClick={() => setAdding((open) => !open)}>
          Add person
        </Btn>
      </div>

      {adding ? (
        <form
          onSubmit={addPerson}
          className="row wrap"
          style={{
            gap: 10,
            marginTop: 16,
            padding: 14,
            borderRadius: 12,
            background: "rgb(var(--color-surface))",
          }}
        >
          {(
            [
              ["name", "Name", 180],
              ["company", "Company", 160],
              ["title", "Title", 160],
              ["email", "Email", 200],
            ] as const
          ).map(([field, label, width]) => (
            <input
              key={field}
              name={field}
              required={field === "name"}
              placeholder={label}
              aria-label={label}
              className="field"
              style={{ height: 34, width, maxWidth: "100%" }}
            />
          ))}
          <button type="submit" className="btn sm p">
            Add
          </button>
          <button type="button" className="btn sm t" onClick={() => setAdding(false)}>
            Cancel
          </button>
          <span className="xs faint">
            Added to this list only. It is not saved to your account yet.
          </span>
        </form>
      ) : null}

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

      {view === "table" ? (
        <div
          className="row wrap"
          style={{ gap: 8, margin: "14px 0 4px" }}
          role="group"
          aria-label="Lists"
        >
          <span className="sm faint" style={{ marginRight: 4 }}>
            Lists
          </span>
          {(
            [
              ["everyone", "Everyone", undefined],
              ["managers", "Hiring managers", counts.managers],
              ["founders", "Founders", counts.founders],
              ["recruiters", "Recruiters", counts.recruiters],
              ["maintainers", "Maintainers", counts.maintainers],
              ["warm", "Warm paths", counts.warm],
            ] as [ListId, string, number | undefined][]
          ).map(([id, label, n]) => (
            <button
              key={id}
              type="button"
              className={`pill ${list === id ? "on" : ""}`}
              style={{ height: 30, fontSize: 13 }}
              aria-pressed={list === id}
              onClick={() => setList(id)}
            >
              {label}
              {n !== undefined ? <span className="faint xs">{n}</span> : null}
            </button>
          ))}
          {customLists.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`pill ${list === entry.id ? "on" : ""}`}
              style={{ height: 30, fontSize: 13 }}
              aria-pressed={list === entry.id}
              onClick={() => applyList(entry.id)}
            >
              {entry.name}
            </button>
          ))}
          {namingList ? (
            <form
              className="row"
              style={{ gap: 6 }}
              onSubmit={(event) => {
                event.preventDefault();
                saveList();
              }}
            >
              <input
                className="field"
                style={{ height: 30, width: 150, fontSize: 13 }}
                value={listName}
                onChange={(event) => setListName(event.target.value)}
                placeholder="Name this list"
                aria-label="Name for the new list"
              />
              <button type="submit" className="btn sm p" disabled={!listName.trim()}>
                Save
              </button>
              <button type="button" className="btn sm t" onClick={() => setNamingList(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <button type="button" className="btn t sm" onClick={() => setNamingList(true)}>
              + New list
            </button>
          )}
        </div>
      ) : null}

      <div className="row wrap" style={{ gap: 18, margin: "12px 0 4px" }}>
        <span className="sm muted">
          {view === "board"
            ? "Drag a person to a new stage, or use Move."
            : plural(rows.length + drafts.length, "person", "people")}
        </span>
        <span className="sp" />
        <span className="sm">
          {replies > 0 ? (
            <>
              <b className="amber">{plural(replies, "reply", "replies")}</b>{" "}
              <span className="muted">waiting.</span>{" "}
            </>
          ) : null}
          {warmUnused > 0 ? (
            <span className="muted">{plural(warmUnused, "warm path", "warm paths")} unused.</span>
          ) : null}
        </span>
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
                    <Th icon="flame">Warmth</Th>
                  </th>
                  <th>
                    <Th icon="users">Best path</Th>
                  </th>
                  <th>
                    <Th icon="flag">Status</Th>
                  </th>
                  <th>
                    <Th icon="mail">Email</Th>
                  </th>
                  <th>
                    <Th icon="arrow">Next</Th>
                  </th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((draft) => (
                  <tr key={draft.id}>
                    <td>
                      <div className="row">
                        <Av i={initialsOf(draft.name)} c={(draft.name.length % 6) + 1} size="xs" />
                        <div>
                          <span className="m">{draft.name}</span>{" "}
                          {draft.title ? <span className="faint xs">{draft.title}</span> : null}
                        </div>
                      </div>
                    </td>
                    <td className="muted">{draft.company || "-"}</td>
                    <td>
                      <Tag>Added by you</Tag>
                    </td>
                    <td>
                      <Warmth w={1} />
                    </td>
                    <td className="muted">No shared path</td>
                    <td>
                      <Status tone="faint">Not saved</Status>
                    </td>
                    <td>{draft.email || <span className="faint">Not found</span>}</td>
                    <td>
                      <button
                        type="button"
                        className="muted"
                        onClick={() =>
                          setDrafts((current) => current.filter((d) => d.id !== draft.id))
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.map((person) => {
                  const warmth = sampleWarmth(person.id);
                  return (
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
                        <Warmth w={warmth} />
                      </td>
                      <td className="muted">{samplePath(person.id, warmth)}</td>
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
                        {person.contacted_at ? (
                          <span className="faint xs">
                            {" "}
                            · {formatRelativeDays(person.contacted_at)}
                          </span>
                        ) : null}
                      </td>
                      <td>
                        <Link
                          href={`/contacts/${person.id}`}
                          className={`row ${person.stage === "replied" ? "amber m" : "muted"}`}
                          style={{ gap: 6 }}
                        >
                          {NEXT_STEP[person.stage]}
                          <Ic n="arrow" size="xs" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="faint">
                      Loading...
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          {!loading && rows.length === 0 && drafts.length === 0 && errors.length === 0 ? (
            <EmptyState className="px-6 py-12 text-center">
              {list === "everyone" ? "Nobody at this stage." : "Nobody on this list yet."}
            </EmptyState>
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
