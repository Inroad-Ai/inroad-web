import { PAGE_TITLES } from "./nav.constants";
import type { NavEntry, NavGroup } from "./nav.types";

export function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

export function navHrefs(entries: NavEntry[]): string[] {
  return entries.flatMap((entry) => (isGroup(entry) ? entry.items.map((i) => i.href) : entry.href));
}

function matchesRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** The longest matching href wins, so /companies/pipeline highlights
 * "Stages" and not "Companies" as well. */
export function findActiveHref(pathname: string | null, hrefs: string[]): string | null {
  if (!pathname) return null;
  let best: string | null = null;
  for (const href of hrefs) {
    if (matchesRoute(pathname, href) && (best === null || href.length > best.length)) {
      best = href;
    }
  }
  return best;
}

export function getPageTitle(pathname: string | null): string {
  if (!pathname) return "";
  const href = findActiveHref(pathname, Object.keys(PAGE_TITLES));
  return href ? PAGE_TITLES[href] : "";
}
