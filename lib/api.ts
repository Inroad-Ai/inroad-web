/** Display helpers for dossier values, covering what the API does not send. */

/** 1615 -> "1.62" seconds. */
export function totalTimeSeconds(elapsedMs: number): string {
  return (elapsedMs / 1000).toFixed(2);
}
