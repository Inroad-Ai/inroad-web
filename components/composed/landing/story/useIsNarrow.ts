"use client";

import { useEffect, useState } from "react";

/** Matches Tailwind's `md` breakpoint: below it the story stacks text over visual. */
const NARROW_QUERY = "(max-width: 767px)";

export function useIsNarrow(): boolean {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY);
    const update = () => setIsNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isNarrow;
}
