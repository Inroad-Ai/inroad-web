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

/** A month-precise ISO date ("2026-10-01") as "October 2026", read in UTC
 * so the reader's time zone never moves it into the previous month. */
export function formatMonth(isoDate: string): string {
  return new Date(`${isoDate.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** An ISO timestamp as "today" / "3 days ago" / "2 weeks ago". */
export function formatRelativeDays(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 14) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 8) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

/** 1, "company", "companies" -> "1 company"; 3 -> "3 companies". */
export function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}
