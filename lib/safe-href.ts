/** A URL that came from scraped or provider data, usable as a link only when
 * it is plain http(s). React does not block `javascript:` hrefs. */
export function safeHref(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}
