"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Menu } from "@/components/ui/Menu";
import type { CareerArcDocument, CareerArcRole, CareerArcWarning } from "@/lib/api-client/client";
import {
  ADD_MENU,
  CAREER_ARC_LIMITS,
  FILTERS,
  countByFilter,
  describeSize,
  inFilter,
  matchesSearch,
  newRole,
  type FilterId,
} from "@/lib/career-arc";

import { RoleRow } from "./RoleRow";

/** Every chapter in one list. The chips narrow it; the Add menu says what kind
 * of chapter is being added, so the form that opens fits it. */
export function ExperienceTab({
  document,
  warnings,
  onChange,
}: {
  document: CareerArcDocument;
  warnings: readonly CareerArcWarning[];
  onChange: (next: CareerArcDocument) => void;
}) {
  const roles = document.roles ?? [];
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<ReadonlySet<string>>(
    () =>
      new Set(
        roles.flatMap((role) =>
          (role.stories ?? []).filter((story) => !story.title.trim()).map((story) => story.id),
        ),
      ),
  );
  const counts = countByFilter(document);
  const visible = roles.filter(
    (role) =>
      inFilter(role, filter) &&
      (!query.trim() || (role.stories ?? []).some((story) => matchesSearch(role, story, query))),
  );

  function toggle(id: string, force?: boolean) {
    setOpen((previous) => {
      const next = new Set(previous);
      if (force ?? !next.has(id)) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function replaceRole(next: CareerArcRole) {
    onChange({ ...document, roles: roles.map((role) => (role.id === next.id ? next : role)) });
  }

  function addRole(kind: Parameters<typeof newRole>[0]) {
    const created = newRole(kind);
    onChange({ ...document, roles: [...roles, created] });
    toggle(created.id, true);
    setFilter("all");
  }

  const prompt = FILTERS.find((option) => option.id === filter)?.prompt;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter chapters">
          {FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={filter === option.id}
              onClick={() => setFilter(option.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-sans-semibold transition-colors duration-fast ${
                filter === option.id
                  ? "bg-signal-amber text-on-amber"
                  : "bg-ink/5 text-ink-muted hover:bg-ink/10 hover:text-ink"
              }`}
            >
              {option.label} {counts[option.id]}
            </button>
          ))}
        </div>
        <Menu
          label="Add a chapter"
          trigger={
            <span className="inline-flex items-center gap-1.5">
              <PlusIcon /> Add
            </span>
          }
          disabled={roles.length >= CAREER_ARC_LIMITS.roles}
          items={ADD_MENU.map((option) => ({
            key: option.kind,
            label: option.label,
            onSelect: () => addRole(option.kind),
          }))}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-sans-semibold text-ink">{describeSize(document)}</p>
        {roles.length > 1 ? (
          <Input
            type="search"
            aria-label="Search your stories"
            placeholder="Search stories"
            className="w-full sm:w-64"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        ) : null}
      </div>

      {visible.map((role) => (
        <RoleRow
          key={role.id}
          role={role}
          warnings={warnings}
          query={query}
          isOpen={(id) => open.has(id)}
          onToggle={toggle}
          onChange={replaceRole}
          onRemove={() =>
            onChange({ ...document, roles: roles.filter((existing) => existing.id !== role.id) })
          }
        />
      ))}

      {visible.length === 0 ? (
        <p className="rounded-nest bg-surface-raised px-4 py-4 text-sm text-ink-muted">
          {query.trim() ? "Nothing matches that search." : prompt}
        </p>
      ) : null}

      {roles.length === 0 ? (
        <Button type="button" variant="quiet" size="sm" onClick={() => addRole("job")}>
          Add a job
        </Button>
      ) : null}
    </div>
  );
}
