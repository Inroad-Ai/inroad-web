/** Display formatting for values the API sends raw. Pure functions only. */

/** 1615 -> "1.62" seconds. */
export function totalTimeSeconds(elapsedMs: number): string {
  return (elapsedMs / 1000).toFixed(2);
}

/** An ISO timestamp as a date and time in the reader's own locale. */
export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
