/** Static sample content for the landing page's Ask console. None of it comes
 * from the API: it is a scripted preview of the product, labelled as sample
 * data in the console itself. */

export interface DemoSource {
  /** Where the quote was read, as shown on the chip: a host or a publisher. */
  label: string;
  quote: string;
  url: string;
}

export type SourceKind = "role" | "funding" | "hiring" | "launch" | "tech" | "team" | "home";

export interface DemoSignal {
  ago: string;
  text: string;
  source: DemoSource;
}

export interface DemoCompany {
  id: string;
  name: string;
  domain: string;
  fit: number;
  tagline: string;
  whyNow?: string;
  matchedRole?: string;
  stack: readonly string[];
  reasons: { role: string; stack: string; stage: string; work: string };
  sources: Partial<Record<SourceKind, DemoSource>> & { home: DemoSource };
  signals: readonly DemoSignal[];
  pagesRead: number;
  articlesRead: number;
  openRoles: number;
  careersBoard: string;
}

export interface DemoPerson {
  id: string;
  companyId: string;
  name: string;
  title: string;
  email: string | null;
  linkedin: string;
  commonGround: readonly string[];
  foundVia: DemoSource;
  draft: { subject: string; body: string };
}

export type Segment = { text: string; strong?: boolean } | { cite: number };

export interface ScanRow {
  name: string;
  count: number;
  unit: string;
}

export interface FitCardData {
  company: DemoCompany;
  why: string;
  cite: number;
}

export type AnswerIcon = "edit" | "doc" | "user" | "search" | "spark";

export interface AnswerChip {
  label: string;
  icon: AnswerIcon;
  question: string;
  /** The chip the scripted demo clicks. */
  isDraft?: boolean;
}

export interface TimelineItem {
  ago: string;
  company: string;
  text: string;
  cite: number;
}

export interface DemoAnswer {
  thinkingLabel: string;
  scanLabel: string;
  doneLabel: string;
  rows: readonly ScanRow[];
  title?: string;
  paragraphs: readonly (readonly Segment[])[];
  cards?: readonly FitCardData[];
  contact?: { email: string | null; linkedin: string };
  timeline?: readonly TimelineItem[];
  draft?: { person: DemoPerson; subject: string; body: string; facts: readonly number[] };
  chips: readonly AnswerChip[];
  /** Citations in order of first use; a Segment's `cite` is an index into this. */
  sources: readonly DemoSource[];
}
