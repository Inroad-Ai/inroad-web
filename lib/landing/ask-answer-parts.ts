import { primaryContactAt } from "./ask-people";
import type {
  AnswerChip,
  DemoCompany,
  DemoSource,
  ScanRow,
  Segment,
  SourceKind,
} from "./ask-types";

/** Shared pieces for building canned console answers. */
export const THINKING = "Thinking…";
export const MARKET_ROWS: readonly ScanRow[] = [
  { name: "Careers pages", count: 1812, unit: "pages" },
  { name: "News", count: 640, unit: "articles" },
  { name: "Team pages", count: 2050, unit: "pages" },
];
export const NEWS_ROWS: readonly ScanRow[] = [
  { name: "News", count: 640, unit: "articles" },
  { name: "Company blogs", count: 212, unit: "posts" },
  { name: "Job boards", count: 1812, unit: "pages" },
];

export function createCiter() {
  const sources: DemoSource[] = [];
  const index = (s: DemoSource): number => {
    const found = sources.findIndex((x) => x.url === s.url && x.quote === s.quote);
    if (found >= 0) return found;
    sources.push(s);
    return sources.length - 1;
  };
  return { sources, index, cite: (s: DemoSource): Segment => ({ cite: index(s) }) };
}

export const text = (value: string, strong = false): Segment => ({ text: value, strong });
export const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
export const pick = (c: DemoCompany, kinds: readonly SourceKind[]): DemoSource =>
  kinds.map((k) => c.sources[k]).find((s): s is DemoSource => s !== undefined) ?? c.sources.home;
export const agoInDays = (ago: string) => parseInt(ago, 10) * (ago.endsWith("w") ? 7 : 1);
export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const rowsFor = (c: DemoCompany): ScanRow[] => [
  { name: `Homepage · ${c.domain}`, count: c.pagesRead, unit: "pages" },
  { name: "News", count: c.articlesRead, unit: "articles" },
  { name: `Careers · ${c.careersBoard}`, count: c.openRoles, unit: "roles" },
];

export const fitQuestion = (c: DemoCompany) => `Why does ${c.name} fit me?`;
export const contactChip = (c: DemoCompany): AnswerChip[] =>
  primaryContactAt(c.id)
    ? [{ label: "Find contact", icon: "user", question: `Who should I write to at ${c.name}?` }]
    : [];
export const draftChip = (c: DemoCompany): AnswerChip[] => {
  const person = primaryContactAt(c.id);
  if (!person) return [];
  const question = `Draft an email to ${person.name} at ${c.name}`;
  return [{ label: "Draft email", icon: "edit", question, isDraft: true }];
};
