"use client";

import { useEffect, useState } from "react";

const TICK_MS = 500;

/** Whole seconds since `startedAt`, ticking while it is set. Null means
 * nothing is running, and reads as 0. */
export function useElapsedSeconds(startedAt: number | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (startedAt === null) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  return startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));
}
