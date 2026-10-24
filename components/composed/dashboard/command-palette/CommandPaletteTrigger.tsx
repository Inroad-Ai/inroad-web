"use client";

import { useEffect, useState } from "react";

import { SearchIcon } from "@/components/ui/Icons";

const APPLE_PLATFORM = /Mac|iPhone|iPad/;

/** Read after mount so the server render and first client render agree. */
function useShortcutLabel(): string {
  const [label, setLabel] = useState("Ctrl K");
  useEffect(() => {
    if (APPLE_PLATFORM.test(navigator.userAgent)) setLabel("⌘K");
  }, []);
  return label;
}

export function CommandPaletteTrigger({ onOpen }: { onOpen: () => void }) {
  const shortcut = useShortcutLabel();

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Search and jump to"
      aria-keyshortcuts="Meta+K Control+K"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-ink/5 text-sm font-sans-semibold text-ink-muted transition-colors duration-fast hover:bg-ink/10 hover:text-ink md:w-56 md:justify-start md:pl-4 md:pr-2"
    >
      <SearchIcon />
      <span className="hidden truncate md:inline">Search or jump to...</span>
      <kbd className="ml-auto hidden rounded-sm bg-ink/10 px-1.5 py-1 font-mono text-2xs text-ink-muted md:inline">
        {shortcut}
      </kbd>
    </button>
  );
}
