"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type KeyboardEvent } from "react";

import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { SearchIcon } from "@/components/ui/Icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { LANDING_EASE } from "@/lib/landing-motion";

import { PaletteOption } from "./PaletteOption";
import { PALETTE_GROUPS, type PaletteCommand, type PaletteGroup } from "./palette.types";
import { usePaletteCommands } from "./usePaletteCommands";
import { usePaletteCompanySearch } from "./usePaletteCompanySearch";

// Matches --motion-duration-fast, the token every other popover uses.
const PANEL_TRANSITION = { duration: 0.16, ease: LANDING_EASE };

const KEY_HINTS = [
  ["↑ ↓", "Move"],
  ["Enter", "Open"],
  ["Esc", "Close"],
] as const;

function optionId(listId: string, index: number): string {
  return `${listId}-option-${index}`;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <PaletteDialog onClose={onClose} />;
}

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const commands = usePaletteCommands();
  const search = usePaletteCompanySearch(query);

  useBodyScrollLock(true);
  useEscapeKey(true, onClose);

  const term = query.trim().toLowerCase();
  const pageAndActionMatches = term
    ? commands.filter((command) =>
        `${command.label} ${command.hint ?? ""}`.toLowerCase().includes(term),
      )
    : commands;
  const companyMatches: PaletteCommand[] = search.companies.map((company) => ({
    id: `company:${company.id}`,
    group: "Companies",
    label: company.homepage_title || company.domain,
    hint: company.domain,
    icon: <CompanyLogo logoUrl={company.logo_url} seed={company.domain} size="xs" />,
    run: () => router.push(`/companies/${company.id}`),
  }));
  const results = [...pageAndActionMatches, ...companyMatches];
  const selectedIndex = Math.min(activeIndex, results.length - 1);
  useEffect(() => {
    document.getElementById(optionId(listId, selectedIndex))?.scrollIntoView({ block: "nearest" });
  }, [listId, selectedIndex]);

  function choose(command: PaletteCommand) {
    onClose();
    command.run();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const count = results.length;
    if (event.key === "Tab") {
      event.preventDefault();
    } else if (event.key === "ArrowDown" && count > 0) {
      event.preventDefault();
      setActiveIndex((selectedIndex + 1) % count);
    } else if (event.key === "ArrowUp" && count > 0) {
      event.preventDefault();
      setActiveIndex((selectedIndex - 1 + count) % count);
    } else if (event.key === "Enter" && results[selectedIndex]) {
      event.preventDefault();
      choose(results[selectedIndex]);
    }
  }

  const indexed = results.map((command, index) => ({ command, index }));
  const groupLabel = (group: PaletteGroup) =>
    group === "Companies" && !term ? "Recent companies" : group;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-scrim/50 px-4 pt-20 sm:pt-28"
      onMouseDown={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search and jump to"
        initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reduceMotion ? { duration: 0 } : PANEL_TRANSITION}
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-card bg-surface shadow-pop"
      >
        <div className="flex items-center gap-3 border-b border-line px-5 text-ink-muted">
          <SearchIcon />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results.length > 0 ? optionId(listId, selectedIndex) : undefined}
            aria-label="Search companies and pages"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search companies, or jump to a page"
            autoComplete="off"
            spellCheck={false}
            className="h-14 min-w-0 flex-1 bg-transparent text-lg font-sans-semibold text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>

        <div
          id={listId}
          role="listbox"
          aria-label="Results"
          className="max-h-96 overflow-y-auto p-2"
        >
          {PALETTE_GROUPS.map((group) => {
            const entries = indexed.filter(({ command }) => command.group === group);
            if (entries.length === 0) return null;
            const headingId = `${listId}-${group}`;
            return (
              <div key={group} role="group" aria-labelledby={headingId}>
                <div id={headingId} className="utility-label px-3 pb-1.5 pt-3 text-ink-faint">
                  {groupLabel(group)}
                </div>
                {entries.map(({ command, index }) => (
                  <PaletteOption
                    key={command.id}
                    id={optionId(listId, index)}
                    command={command}
                    active={index === selectedIndex}
                    onHover={() => setActiveIndex(index)}
                    onSelect={() => choose(command)}
                  />
                ))}
              </div>
            );
          })}
          <PaletteStatus
            searching={search.loading && companyMatches.length === 0}
            error={search.error}
            empty={results.length === 0 && !search.loading}
          />
        </div>

        <div className="hidden items-center gap-4 border-t border-line px-5 py-3 sm:flex">
          {KEY_HINTS.map(([keys, action]) => (
            <span key={action} className="utility-label flex items-center gap-1.5 text-ink-faint">
              <kbd className="rounded-sm bg-ink/10 px-1.5 py-0.5 font-mono text-ink-muted">
                {keys}
              </kbd>
              {action}
            </span>
          ))}
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          {search.loading ? "" : `${results.length} results`}
        </p>
      </motion.div>
    </div>
  );
}

function PaletteStatus({
  searching,
  error,
  empty,
}: {
  searching: boolean;
  error: string | null;
  empty: boolean;
}) {
  const message =
    error ?? (searching ? "Searching your companies..." : empty ? "Nothing matches that." : null);
  if (!message) return null;
  return (
    <p className={`px-3 py-3 text-sm ${error ? "text-error" : "text-ink-muted"}`}>{message}</p>
  );
}
