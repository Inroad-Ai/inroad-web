import type { CompanyDetail, CompanySignal, RolePosting, SourcedFact } from "@/lib/types";

/** The company page's content, cleaned once: names and labels made human,
 * repeats dropped, long lists trimmed, nothing raw (JSON, snake_case, bare
 * provider ids) left for a component to show. Every section reads this. */
export interface CompanyBrief {
  name: string;
  summary: string | null;
  chips: string[];
  why: BriefWhy | null;
  about: BriefEntry[];
  techStack: string[];
  leaders: { name: string; title: string | null }[];
  highlights: BriefEntry[];
  /** The open roles that do not fit the person, grouped: `listed` of them
   * here, `total` on the board (its own count), `fitting` shown elsewhere. */
  roles: { listed: number; total: number; fitting: number; groups: RoleGroup[] };
  board: { label: string; url: string | null } | null;
  careersUrl: string | null;
  products: { name: string; description: string | null; url: string | null }[];
  news: { title: string; date: string | null; url: string; kind: string }[];
  momentum: Momentum | null;
  hooks: Hook[];
}

/** Roles posted recently, by the board's own posting date. */
export interface Momentum {
  newRoles: number;
  days: number;
  departments: string[];
}

/** Something specific and dated to mention when reaching out. */
export interface Hook {
  text: string;
  date: string | null;
  url: string | null;
}

export interface BriefWhy {
  roleTitle: string | null;
  roleUrl: string | null;
  fitReason: string | null;
  whyNow: string | null;
}

export interface BriefEntry {
  label: string;
  text: string;
  sourceUrl: string | null;
}

export interface BriefRole {
  /** Unique within the company: openings on one careers page share a URL. */
  key: string;
  title: string;
  url: string | null;
  place: string | null;
}

export interface RoleGroup {
  department: string;
  roles: BriefRole[];
}

const CAREERS_PAGE_SOURCE = "careers-page";
const PROVIDERS: Record<string, string> = {
  greenhouse: "Greenhouse",
  lever: "Lever",
  ashby: "Ashby",
  workable: "Workable",
  smartrecruiters: "SmartRecruiters",
  recruitee: "Recruitee",
};

/** Facts worth a line of their own. The rest are shown elsewhere already
 * (summary, about, tech stack, chips, products, leaders) or say nothing new. */
const HIGHLIGHT_LABELS: Record<string, string> = {
  target_customer: "Who they sell to",
  hiring_status: "On hiring",
  hiring_area: "Hiring for",
  workplace_policy: "How they work",
  engineering_practice: "How they build",
  benefit: "Benefits",
  company_value: "Values",
};
const MAX_HIGHLIGHTS = 6;
// Six benefits crowd out everything else worth knowing.
const MAX_PER_HIGHLIGHT_LABEL = 2;
const MAX_PRODUCTS = 6;
const MAX_NEWS = 5;
const MAX_TECH = 12;
const SUMMARY_CHARS = 220;
const TEXT_CHARS = 420;
const CLOSED = "not_seen_in_latest_scan";
const MOMENTUM_DAYS = 30;
const DAY_MS = 86_400_000;
// News older than this is history, not a reason to write today.
const HOOK_DAYS = 180;
const MAX_HOOKS = 3;
// A layoff is news, never an opener.
const NOT_A_HOOK = new Set(["layoff"]);
const OTHER_DEPARTMENT = "Other roles";
const GENERIC_TITLE = /^(home|homepage|home page|welcome|index|official site|official website)$/i;

export function buildBrief(detail: CompanyDetail): CompanyBrief {
  const research = detail.latest_research;
  const profile = detail.profile;
  const facts = research?.facts ?? [];
  const firstFact = (type: string) => facts.find((f) => f.fact_type === type);

  const summary = clip(clean(profile?.what_it_does), SUMMARY_CHARS);
  const shown = new Set<string>(summary ? [key(summary)] : []);

  const about = [
    entry(shown, "Problem they solve", profile?.problem_solved, null),
    entry(shown, "What they stand for", profile?.introduction, null),
    entry(shown, "Biggest challenge right now", profile?.biggest_challenge, null),
    entry(shown, "Funding", profile?.funding, null),
  ].filter(isEntry);

  const name = companyName(detail, firstFact("company_name"));
  const pickedNames = new Set(
    detail.people.filter((p) => p.contact_rank !== null).map((p) => p.name.toLowerCase()),
  );

  return {
    name,
    summary,
    chips: chips(
      detail,
      factText(firstFact("industry")),
      factText(firstFact("headquarters")),
      factText(firstFact("founded_year")),
    ),
    why: why(detail),
    about,
    techStack: techStack(profile?.tech_stack ?? [], name).slice(0, MAX_TECH),
    leaders: uniqueBy(
      (research?.leadership ?? [])
        .filter((leader) => !pickedNames.has(leader.name.toLowerCase()))
        .map((leader) => ({ name: clean(leader.name) ?? "", title: clean(leader.title) })),
      (leader) => leader.name.toLowerCase(),
    ).filter((leader) => leader.name),
    highlights: facts
      .filter((fact) => fact.fact_type in HIGHLIGHT_LABELS)
      .map((fact) =>
        entry(
          shown,
          HIGHLIGHT_LABELS[fact.fact_type],
          factText(fact),
          fact.evidence[0]?.source_url ?? null,
        ),
      )
      .filter(isEntry)
      .filter(atMostPerLabel(MAX_PER_HIGHLIGHT_LABEL))
      .slice(0, MAX_HIGHLIGHTS),
    roles: roles(
      research?.hiring?.role_postings ?? [],
      detail.open_roles,
      new Set((detail.fitting_roles ?? []).map((role) => `${role.url ?? ""}|${role.title}`)),
    ),
    board: board(detail),
    careersUrl:
      detail.company_careers_url ??
      (detail.hiring_source === CAREERS_PAGE_SOURCE ? detail.careers_url : null),
    products: uniqueBy(
      (research?.products ?? []).map((product) => ({
        name: clean(product.name) ?? "",
        description: clip(clean(product.description), 160),
        url: product.url,
      })),
      (product) => product.name.toLowerCase(),
    )
      .filter((product) => product.name)
      .slice(0, MAX_PRODUCTS),
    news: news(research?.signals ?? []),
    momentum: momentum(research?.hiring?.role_postings ?? []),
    hooks: hooks(detail, research?.signals ?? []),
  };
}

/** "Linear – Plan and build products" is "Linear"; "Home - AnaVation" is
 * "AnaVation": the title segment naming the domain wins, generic ones never. */
function companyName(detail: CompanyDetail, nameFact: SourcedFact | undefined): string {
  const stated = clean(factText(nameFact)) ?? clean(detail.latest_research?.hiring?.company_name);
  return stated ?? companyDisplayName(detail);
}

/** A saved company's name from its homepage title, for lists that have no
 * research loaded (Overview, Companies, Pipeline). */
export function companyDisplayName(company: { domain: string; homepage_title: string | null }) {
  const segments = (clean(company.homepage_title) ?? "")
    .split(/\s+[|–—:·•-]\s+/)
    .map((segment) => segment.trim())
    .filter(
      (segment) => segment.length > 1 && segment.length <= 40 && !GENERIC_TITLE.test(segment),
    );
  const root = key(company.domain.split(".")[0] ?? "").replace(/ /g, "");
  const named = segments.find((segment) => key(segment).replace(/ /g, "").includes(root));
  return named ?? segments[0] ?? company.domain;
}

/** What they build with, not what they sell: "Supabase Auth" is a product. */
function techStack(stack: string[], name: string): string[] {
  const own = key(name);
  return unique(stack.map(clean).filter(isText)).filter((tech) => !key(tech).includes(own));
}

function chips(
  detail: CompanyDetail,
  industry: string | null,
  headquarters: string | null,
  founded: string | null,
): string[] {
  const size = clean(detail.profile?.company_size);
  const openRoles = detail.open_roles;
  const hiring =
    detail.is_hiring && openRoles
      ? `Hiring · ${openRoles} open ${openRoles === 1 ? "role" : "roles"}`
      : detail.is_hiring
        ? "Hiring"
        : null;
  return [
    clip(clean(industry), 40),
    clip(clean(headquarters), 40),
    size ? clip(size, 40) : null,
    founded && /\d{4}/.test(founded) ? `Founded ${founded.match(/\d{4}/)?.[0]}` : null,
    hiring,
  ]
    .filter(isText)
    .map(sentenceCase);
}

function why(detail: CompanyDetail): BriefWhy | null {
  const matched = detail.matched_role_title;
  const fit = detail.fitting_roles ?? [];
  const fitReason =
    fit.find((role) => role.url && role.url === detail.matched_role_url)?.reason ??
    (matched ? null : fit[0]?.reason) ??
    null;
  const whyNow = clean(detail.profile?.why_reach_out_now);
  if (!matched && !whyNow && !fitReason) return null;
  return {
    roleTitle: matched ?? fit[0]?.title ?? null,
    roleUrl: matched ? detail.matched_role_url : (fit[0]?.url ?? null),
    fitReason,
    whyNow,
  };
}

function roles(
  postings: RolePosting[],
  boardCount: number | null,
  fittingKeys: Set<string>,
): CompanyBrief["roles"] {
  const all = uniqueBy(
    postings.filter((posting) => posting.availability !== CLOSED),
    (posting) => `${postingKey(posting)}|${posting.location ?? ""}`,
  );
  const open = all.filter((posting) => !fittingKeys.has(postingKey(posting)));
  const byDepartment = new Map<string, BriefRole[]>();
  for (const posting of open) {
    const department = clean(posting.department) ?? OTHER_DEPARTMENT;
    const list = byDepartment.get(department) ?? [];
    list.push({
      key: `${postingKey(posting)}|${posting.location ?? ""}`,
      title: posting.title.trim(),
      url: posting.url,
      place: place(posting),
    });
    byDepartment.set(department, list);
  }
  const groups = [...byDepartment.entries()]
    .map(([department, list]) => ({
      department,
      roles: list.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort(
      (a, b) =>
        Number(a.department === OTHER_DEPARTMENT) - Number(b.department === OTHER_DEPARTMENT) ||
        b.roles.length - a.roles.length ||
        a.department.localeCompare(b.department),
    );
  // One group is no grouping: its name ("Acme Job Opportunities") says nothing.
  const single = groups.length === 1 ? [{ ...groups[0], department: "" }] : groups;
  return {
    listed: open.length,
    total: Math.max(all.length, boardCount ?? 0),
    fitting: all.length - open.length,
    groups: single,
  };
}

/** "Berlin; Remote" with "Remote" said once, never "Remote · Remote". */
function place(posting: RolePosting): string | null {
  const parts = (posting.location ?? "")
    .split(/[;,]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  const remote = posting.remote || posting.workplace_type === "remote";
  if (remote && !parts.some((part) => /remote/i.test(part))) parts.push("Remote");
  const distinct = unique(parts);
  if (distinct.length === 0) return null;
  return distinct.length > 3
    ? `${distinct.slice(0, 3).join(", ")} +${distinct.length - 3}`
    : distinct.join(", ");
}

/** The job board, when there is one. A careers page is not a board: it
 * shows as the careers page link, never as "on Careers page". */
/** Openings read off one careers page share its URL, so the title is part
 * of the key (and the place too when de-duplicating). Fitting roles carry
 * URL and title only, so that pair is what they are matched on. */
function postingKey(posting: RolePosting): string {
  return `${posting.url ?? ""}|${posting.title}`;
}

function board(detail: CompanyDetail): { label: string; url: string | null } | null {
  const source = detail.hiring_source;
  if (!source || source === CAREERS_PAGE_SOURCE) return null;
  return { label: PROVIDERS[source] ?? titleCase(source), url: detail.careers_url };
}

function momentum(postings: RolePosting[], now = Date.now()): Momentum | null {
  const since = now - MOMENTUM_DAYS * DAY_MS;
  const recent = postings.filter(
    (posting) =>
      posting.availability !== CLOSED &&
      posting.posted_at !== null &&
      Date.parse(posting.posted_at) >= since,
  );
  if (recent.length === 0) return null;
  const counts = new Map<string, number>();
  for (const posting of recent) {
    const department = clean(posting.department);
    if (department) counts.set(department, (counts.get(department) ?? 0) + 1);
  }
  return {
    newRoles: recent.length,
    days: MOMENTUM_DAYS,
    departments: [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([department]) => department),
  };
}

/** Up to three things worth a line in a first message: recent news first,
 * then how fast they are hiring for the person's kind of role. */
function hooks(detail: CompanyDetail, signals: CompanySignal[], now = Date.now()): Hook[] {
  const since = now - HOOK_DAYS * DAY_MS;
  const fromNews = newsItems(signals)
    .filter(
      (item) =>
        item.current &&
        !NOT_A_HOOK.has(item.type) &&
        item.date !== null &&
        Date.parse(item.date) >= since,
    )
    .map((item) => ({ text: `${item.kind}: ${item.title}`, date: item.date, url: item.url }));

  const recent = momentum(detail.latest_research?.hiring?.role_postings ?? [], now);
  const fit = detail.fitting_roles ?? [];
  const fromHiring: Hook[] = [];
  if (recent) {
    const where = recent.departments.length ? ` in ${recent.departments.join(" and ")}` : "";
    fromHiring.push({
      text: `They posted ${recent.newRoles} new ${recent.newRoles === 1 ? "role" : "roles"}${where} in the last ${recent.days} days.`,
      date: null,
      url: null,
    });
  }
  if (fit.length > 0) {
    fromHiring.push({
      text: `${fit[0].title} is open and fits you (${fit[0].reason}).`,
      date: null,
      url: fit[0].url,
    });
  }
  return [...fromNews, ...fromHiring].slice(0, MAX_HOOKS);
}

function news(signals: CompanySignal[]): CompanyBrief["news"] {
  return newsItems(signals)
    .slice(0, MAX_NEWS)
    .map(({ title, date, url, kind }) => ({ title, date, url, kind }));
}

/** Titled news, each story once, newest first: what both the news list and
 * the outreach hooks read. Older stories stay in the list; only current ones
 * become hooks. */
function newsItems(signals: CompanySignal[]) {
  return uniqueBy(
    signals.filter((signal) => clean(signal.title)),
    (signal) => signal.url,
  )
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .map((signal) => ({
      type: signal.signal_type,
      kind: titleCase(signal.signal_type.replaceAll("_", " ")),
      title: clip(clean(signal.title), 140) ?? "",
      date: signal.date,
      url: signal.url,
      current: signal.is_current !== false,
    }));
}

/** A fact's readable text, or null: never the raw JSON of an odd value. */
export function factText(fact: SourcedFact | undefined): string | null {
  if (!fact) return null;
  const { text, name, description, value, year } = fact.value as Record<string, unknown>;
  for (const candidate of [text, value, year]) {
    if (typeof candidate === "string" || typeof candidate === "number") return String(candidate);
  }
  if (typeof name === "string") {
    return typeof description === "string" ? `${name}: ${description}` : name;
  }
  return null;
}

function clean(text: string | null | undefined): string | null {
  if (typeof text !== "string") return null;
  const tidy = text.replace(/\s+/g, " ").trim();
  return tidy.length >= 2 ? tidy : null;
}

function clip(text: string | null, max: number): string | null {
  if (text === null || text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 20)).replace(/[,;:.\s]+$/, "")}…`;
}

function key(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Null for empty text and for a sentence already shown elsewhere on the page. */
function entry(
  shown: Set<string>,
  label: string,
  raw: string | null | undefined,
  sourceUrl: string | null,
): BriefEntry | null {
  const text = clip(clean(raw), TEXT_CHARS);
  if (text === null) return null;
  const k = key(text);
  if (shown.has(k)) return null;
  shown.add(k);
  return { label, text, sourceUrl };
}

function atMostPerLabel(limit: number): (entry: BriefEntry) => boolean {
  const counts = new Map<string, number>();
  return (entry) => {
    const count = (counts.get(entry.label) ?? 0) + 1;
    counts.set(entry.label, count);
    return count <= limit;
  };
}

function isEntry(value: BriefEntry | null): value is BriefEntry {
  return value !== null;
}

function isText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

function unique(values: string[]): string[] {
  return uniqueBy(values, (value) => value.toLowerCase());
}

function uniqueBy<T>(items: T[], keyOf: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = keyOf(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** "fully remote" is "Fully remote"; the rest is left as written. */
function sentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function titleCase(text: string): string {
  return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
