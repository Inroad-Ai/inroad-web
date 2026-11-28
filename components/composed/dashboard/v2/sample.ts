// Stand-in values for what the backend does not provide yet (fit scores,
// funding, warmth and so on). Derived from the record's id so a given company
// or person always shows the same numbers between renders and visits.

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(seed: string, salt: string, options: readonly T[]): T {
  return options[hash(`${salt}:${seed}`) % options.length];
}

const FUNDING = [
  "$42M B",
  "$18M A",
  "$60M B",
  "Seed",
  "$9M A",
  "$120M C",
  "$30M A",
  "Seed",
  "$24M A",
];

export function sampleFit(seed: string): number {
  return 70 + (hash(`fit:${seed}`) % 26);
}

export function sampleFunding(seed: string): string {
  return pick(seed, "funding", FUNDING);
}

export function sampleWarmth(seed: string): number {
  return 1 + (hash(`warmth:${seed}`) % 3);
}

const PATHS = [
  "You, Marcus, Priya",
  "Same repo, Ledgerkit",
  "Go Berlin meetup",
  "Conference talk",
  "Past colleague",
  "No shared path",
];

export function samplePath(seed: string, warmth: number): string {
  return warmth === 1 ? "No shared path" : pick(seed, "path", PATHS.slice(0, 5));
}

export interface ExtraColumn {
  id: string;
  label: string;
  icon: string;
  group: "Find" | "People" | "Signals";
}

export const EXTRA_COLUMNS: ExtraColumn[] = [
  { id: "hiring-manager", label: "Hiring manager", icon: "user", group: "People" },
  { id: "visa", label: "Visa sponsor", icon: "shield", group: "Signals" },
  { id: "tech-overlap", label: "Tech overlap", icon: "code", group: "Signals" },
  { id: "funding-history", label: "Funding history", icon: "dollar", group: "Find" },
  { id: "headcount", label: "Headcount growth", icon: "trend", group: "Find" },
  { id: "tech-stack", label: "Tech stack", icon: "layers", group: "Find" },
  { id: "email", label: "Verified email", icon: "mail", group: "People" },
  { id: "warm-path", label: "Warm path", icon: "users", group: "People" },
  { id: "oss-hiring", label: "Open-source hiring", icon: "github", group: "Signals" },
  { id: "news", label: "News", icon: "book", group: "Signals" },
];

const MANAGERS = ["Priya Nair", "Dana Lee", "Tom Berg", "Jo Chen", "Xi Yan"];
const STACKS = [
  "Python, Go, Postgres",
  "Go, Kafka, K8s",
  "Rust, Postgres",
  "Python, Django, AWS",
  "TypeScript, Node",
];

export function sampleExtra(columnId: string, seed: string): string {
  switch (columnId) {
    case "hiring-manager":
      return pick(seed, "mgr", MANAGERS);
    case "visa":
      return pick(seed, "visa", ["Blue Card", "Blue Card", "IND register", "Unknown"]);
    case "tech-overlap":
      return `${60 + (hash(`tech:${seed}`) % 38)}%`;
    case "funding-history":
      return pick(seed, "hist", ["Seed, A, B", "Seed, A", "Seed", "A, B, C"]);
    case "headcount":
      return `+${10 + (hash(`hc:${seed}`) % 45)}% in 12 months`;
    case "tech-stack":
      return pick(seed, "stack", STACKS);
    case "email":
      return pick(seed, "email", ["Found, Hunter", "Found, public site", "Not found"]);
    case "warm-path":
      return samplePath(seed, sampleWarmth(seed));
    case "oss-hiring":
      return pick(seed, "oss", ["Yes, 3 hires", "No", "Yes, 1 hire"]);
    case "news":
      return pick(seed, "news", ["Raised a round", "New CTO", "Quiet", "Launch"]);
    default:
      return "-";
  }
}
