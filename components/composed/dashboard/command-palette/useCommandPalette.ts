"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Open state plus the Cmd/Ctrl+K shortcut. Focus goes back to whatever had
 * it when the palette opened, captured here because the palette's own input
 * takes focus before any effect inside it could record the previous one. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openPalette = useCallback(() => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    returnFocusRef.current?.focus();
    returnFocusRef.current = null;
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      if (open) closePalette();
      else openPalette();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, openPalette, closePalette]);

  return { open, openPalette, closePalette };
}
