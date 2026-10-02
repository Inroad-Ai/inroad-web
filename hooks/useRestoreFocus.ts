"use client";

import { useEffect } from "react";

/** While active, remembers what had focus before and hands focus back to it
 * on close, so keyboard users land where they were instead of at the top of
 * the page. */
export function useRestoreFocus(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const previous = document.activeElement;
    return () => {
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [active]);
}
