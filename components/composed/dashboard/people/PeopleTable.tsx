"use client";

import { useState } from "react";

import { formatRelativeDays } from "@/lib/format";
import { PERSON_ROLE_LABEL, type PersonListItem, type PersonStage } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  PERSON_STAGES,
  PERSON_STAGE_LABEL,
  PersonStageBadge,
} from "@/components/ui/PersonStageBadge";
import { Notice } from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import type { BoardState } from "./usePeopleBoard";

type StageFilter = PersonStage | "all";

const FILTER_TABS: TabItem[] = [
  { id: "all", label: "All" },
  ...PERSON_STAGES.map((stage) => ({ id: stage, label: PERSON_STAGE_LABEL[stage] })),
];

const COLUMNS = ["Person", "Company", "Role", "Stage", "Email", "Contacted"] as const;
const SKELETON_ROWS = 4;

export function PeopleTable({
  board,
  onOpen,
  onLoadMore,
}: {
  board: BoardState;
  onOpen: (id: string) => void;
  onLoadMore: (stage: PersonStage) => void;
}) {
  const [filter, setFilter] = useState<StageFilter>("all");
  const stages = filter === "all" ? PERSON_STAGES : [filter];
  const rows = stages.flatMap((stage) => board[stage].items);
  const isLoading = stages.some((stage) => board[stage].status === "loading");
  const errors = Array.from(
    new Set(
      stages
        .filter((stage) => board[stage].status === "error")
        .map((stage) => board[stage].errorMessage),
    ),
  );
  const pagedStages = stages.filter(
    (stage) => board[stage].status === "ready" && board[stage].items.length < board[stage].total,
  );

  return (
    <div className="flex flex-col gap-4">
      <Tabs items={FILTER_TABS} activeId={filter} onChange={(id) => setFilter(id as StageFilter)} />

      {errors.map((message) => (
        <Notice key={message}>{message}</Notice>
      ))}

      <Card padding="none" className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              {COLUMNS.map((column, index) => (
                <th key={index} scope="col" className="utility-label px-5 py-4 text-ink-muted">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((person) => (
              <PeopleRow key={person.id} person={person} onOpen={() => onOpen(person.id)} />
            ))}
            {isLoading && rows.length === 0
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td colSpan={COLUMNS.length} className="px-5 py-3.5">
                      <Skeleton className="h-4 w-1/2" />
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        {!isLoading && rows.length === 0 && errors.length === 0 ? (
          <EmptyState className="px-6 py-12 text-center">Nobody at this stage.</EmptyState>
        ) : null}
      </Card>

      {pagedStages.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {pagedStages.map((stage) => {
            const column = board[stage];
            return (
              <Button
                key={stage}
                variant="quiet"
                size="sm"
                onClick={() => onLoadMore(stage)}
                disabled={column.loadingMore}
              >
                {column.loadingMore
                  ? "Loading..."
                  : `Show more ${PERSON_STAGE_LABEL[stage]} (${column.total - column.items.length} left)`}
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function PeopleRow({ person, onOpen }: { person: PersonListItem; onOpen: () => void }) {
  return (
    <tr
      tabIndex={0}
      role="button"
      aria-label={`Open ${person.name}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen();
      }}
      className="cursor-pointer border-b border-line text-sm transition-colors duration-fast last:border-0 hover:bg-ink/5 focus-visible:bg-ink/5 focus-visible:-outline-offset-2"
    >
      <td className="px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={person.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-sans-semibold text-ink">{person.name}</p>
            {person.title ? (
              <p className="truncate text-xs text-ink-muted">{person.title}</p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-ink-muted">{person.company_domain}</td>
      <td className="px-5 py-3.5 text-ink">{PERSON_ROLE_LABEL[person.role_category]}</td>
      <td className="px-5 py-3.5">
        <PersonStageBadge stage={person.stage} />
      </td>
      <td className="px-5 py-3.5">
        {person.email ? (
          <Badge tone="teal" dot>
            Found
          </Badge>
        ) : (
          <Badge tone="neutral">Missing</Badge>
        )}
      </td>
      <td className="px-5 py-3.5 text-ink-muted">
        {person.contacted_at ? formatRelativeDays(person.contacted_at) : "Not yet"}
      </td>
    </tr>
  );
}
