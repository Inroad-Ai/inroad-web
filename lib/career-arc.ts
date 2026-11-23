import type {
  CareerArcDocument,
  CareerArcParseRun,
  CareerArcRecognition,
  CareerArcRole,
  CareerArcStory,
  CareerArcStrength,
  CareerArcWarning,
} from "@/lib/api-client/client";

export const MAX_CAREER_ARC_BYTES = 25 * 1024 * 1024;
export const CAREER_ARC_EXTENSIONS = ["pdf", "docx", "txt", "md", "markdown"] as const;
export const CAREER_ARC_ACCEPT = [
  ...CAREER_ARC_EXTENSIONS.map((extension) => `.${extension}`),
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
].join(",");

export const CAREER_ARC_FORMATS_HINT = "PDF, DOCX, TXT or MD · up to 25MB";
export const CAREER_ARC_UPLOAD_PHASES = ["Uploading…", "Reading the file…"] as const;

export const TEMPLATE_DOCX_PATH = "/templates/career-arc-template.docx";
export const TEMPLATE_MD_PATH = "/templates/career-arc-template.md";

// Mirror of inroad-api's app/core/career_arc_limits.py. The API is the
// authority; these only stop a save the API would refuse.
export const CAREER_ARC_LIMITS = {
  roles: 60,
  storiesPerRole: 50,
  storiesTotal: 400,
  intro: 4000,
  lookingFor: 2000,
  notLookingFor: 2000,
  workingStyle: 500,
  title: 200,
  shortField: 200,
  longField: 4000,
  overview: 4000,
  detail: 500,
  teamSize: 10000,
  statement: 500,
  themes: 40,
  principles: 60,
  skills: 200,
  stack: 40,
  storySkills: 30,
  skill: 60,
  links: 10,
  link: 500,
  strengths: 40,
  strengthSkill: 100,
  howItShows: 1000,
  evidence: 6,
  recognition: 80,
  recognitionField: 200,
} as const;

export const CAREER_ARC_SCHEMA_VERSION = 1;

export const EMPTY_CAREER_ARC: CareerArcDocument = {
  schema_version: CAREER_ARC_SCHEMA_VERSION,
  roles: [],
};

type Kind = CareerArcRole["kind"] & string;

export const ROLE_KINDS: { value: Kind; label: string }[] = [
  { value: "job", label: "Job" },
  { value: "project", label: "Project" },
  { value: "open_source", label: "Open source" },
  { value: "education", label: "Study" },
  { value: "organization", label: "Organization" },
  { value: "volunteering", label: "Volunteering" },
  { value: "giving", label: "Giving back" },
  { value: "other", label: "Other" },
];

export const PRIVATE_BY_DEFAULT_KINDS: readonly Kind[] = ["giving", "other"];
export const PROJECT_KINDS: readonly Kind[] = ["project", "open_source"];
export const CAUSE_KINDS: readonly Kind[] = ["organization", "volunteering", "giving"];

export const ADD_MENU: { kind: Kind; label: string }[] = [
  { kind: "job", label: "Job" },
  { kind: "project", label: "Project" },
  { kind: "open_source", label: "Open source" },
  { kind: "education", label: "Study" },
  { kind: "organization", label: "Organization" },
  { kind: "volunteering", label: "Volunteering" },
  { kind: "giving", label: "Giving back" },
];

export type FilterId = "all" | "work" | "projects" | "beyond";

export const FILTERS: { id: FilterId; label: string; kinds: readonly Kind[]; prompt: string }[] = [
  { id: "all", label: "All", kinds: [], prompt: "Add your first job, project or organization." },
  {
    id: "work",
    label: "Work",
    kinds: ["job", "education"],
    prompt: "Add a job, internship or period of study.",
  },
  {
    id: "projects",
    label: "Projects",
    kinds: ["project", "open_source"],
    prompt: "Built something on your own, for a hackathon or in the open? Add it as a project.",
  },
  {
    id: "beyond",
    label: "Beyond work",
    kinds: ["organization", "volunteering", "giving", "other"],
    prompt:
      "Tell us about something you organized, a group you helped, or someone you mentored. Pick one.",
  },
];

export const PROJECT_STATUSES: { value: string; label: string }[] = [
  { value: "live", label: "Live" },
  { value: "shipped", label: "Shipped" },
  { value: "in_progress", label: "In progress" },
  { value: "paused", label: "Paused" },
  { value: "retired", label: "Retired" },
];

export const OWNERSHIPS: { value: string; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "led", label: "Led a team" },
  { value: "contributed", label: "Contributed" },
];

export const RECOGNITION_KINDS: { value: string; label: string }[] = [
  { value: "award", label: "Award" },
  { value: "ranking", label: "Ranking" },
  { value: "certification", label: "Certification" },
  { value: "talk", label: "Talk" },
  { value: "writing", label: "Writing" },
  { value: "other", label: "Other" },
];

export const WORKING_STYLE_PROMPTS: { key: string; label: string; hint: string }[] = [
  { key: "feedback", label: "Feedback", hint: "How you like to give and get it." },
  { key: "communication", label: "Communication", hint: "How you keep people in the loop." },
  { key: "decisions", label: "Decisions", hint: "How you decide when it is unclear." },
  { key: "energizes", label: "What energizes me", hint: "The work you lose track of time in." },
  { key: "drains", label: "What drains me", hint: "What you would rather avoid." },
];

export const STRENGTH_SUGGESTIONS = [
  "Writing clearly",
  "Presenting",
  "Explaining to non-technical people",
  "Listening",
  "Leading a team",
  "Mentoring",
  "Delegating",
  "Running meetings",
  "Giving and taking feedback",
  "Resolving conflict",
  "Working across teams",
  "Ownership",
  "Deciding under uncertainty",
  "Teaching",
  "Organizing events",
  "Fundraising",
  "Negotiating",
] as const;

type PartKey =
  "situation" | "my_role" | "actions" | "why" | "trade_offs" | "outcome" | "limits" | "lessons";

export const STORY_PARTS: { key: PartKey; label: string; hint?: string }[] = [
  { key: "situation", label: "Situation", hint: "What it was and the problem." },
  { key: "my_role", label: "My role" },
  { key: "actions", label: "What I did", hint: "How, in order." },
  { key: "why", label: "Why", hint: "The business and technical reasons." },
  { key: "trade_offs", label: "Trade-offs", hint: "What you considered and gave up." },
  { key: "outcome", label: "Result", hint: "With the numbers." },
  { key: "limits", label: "Limits of the result", hint: "The method and what it does not prove." },
  { key: "lessons", label: "What I'd do differently" },
];

export const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  organization: "Name",
  role: "My role",
  start_date: "Start",
  end_date: "End",
  overview: "Overview",
  stack: "Tools and skills",
  notes: "Notes",
  skills: "Skills",
  links: "Links",
  story: "Summary",
  looking_for: "What I am looking for",
  not_looking_for: "What I am not looking for",
  audience: "Who uses it",
  cause: "Cause",
  commitment: "Commitment",
  reach: "Reach",
  ...Object.fromEntries(STORY_PARTS.map(({ key, label }) => [key, label])),
};

export function validateCareerArcFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(CAREER_ARC_EXTENSIONS as readonly string[]).includes(extension)) {
    return `We can't read .${extension || "unknown"} files. Upload a PDF, DOCX, TXT or Markdown file.`;
  }
  if (file.size > MAX_CAREER_ARC_BYTES) {
    return "That file is larger than 25MB. Export it again without images, or save it as a text file.";
  }
  return null;
}

export function filledParts(story: CareerArcStory): number {
  return STORY_PARTS.filter(({ key }) => Boolean(story[key]?.trim())).length;
}

export function storyCount(document: CareerArcDocument | null | undefined): number {
  return (document?.roles ?? []).reduce((total, role) => total + (role.stories?.length ?? 0), 0);
}

export function hasContent(document: CareerArcDocument | null | undefined): boolean {
  return (document?.roles?.length ?? 0) > 0;
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function describeSize(document: CareerArcDocument | null | undefined): string {
  const parts = [
    plural(document?.roles?.length ?? 0, "chapter", "chapters"),
    plural(storyCount(document), "story", "stories"),
  ];
  const strengths = document?.strengths?.length ?? 0;
  if (strengths > 0) parts.push(plural(strengths, "strength", "strengths"));
  return parts.join(", ");
}

export function kindLabel(kind: string | undefined): string {
  return ROLE_KINDS.find((option) => option.value === kind)?.label ?? "Job";
}

export function isPrivateByDefault(kind: string | undefined): boolean {
  return PRIVATE_BY_DEFAULT_KINDS.includes((kind ?? "job") as Kind);
}

export function roleLabel(role: CareerArcRole): string {
  return (
    [role.organization, role.role].filter(Boolean).join(" · ") ||
    `Untitled ${kindLabel(role.kind).toLowerCase()}`
  );
}

export function inFilter(role: CareerArcRole, filter: FilterId): boolean {
  if (filter === "all") return true;
  const kinds = FILTERS.find((option) => option.id === filter)?.kinds ?? [];
  return kinds.includes((role.kind ?? "job") as Kind);
}

export function countByFilter(document: CareerArcDocument): Record<FilterId, number> {
  const roles = document.roles ?? [];
  return {
    all: roles.length,
    work: roles.filter((role) => inFilter(role, "work")).length,
    projects: roles.filter((role) => inFilter(role, "projects")).length,
    beyond: roles.filter((role) => inFilter(role, "beyond")).length,
  };
}

export function newRole(kind: Kind = "job"): CareerArcRole {
  return { id: crypto.randomUUID(), kind, is_current: false, stack: [], links: [], stories: [] };
}

export function newStory(kind: string | undefined = "job"): CareerArcStory {
  return {
    id: crypto.randomUUID(),
    title: "",
    source: "edited",
    featured: false,
    use_in_outreach: !isPrivateByDefault(kind),
    skills: [],
    links: [],
  };
}

export function newStrength(skill = ""): CareerArcStrength {
  return { id: crypto.randomUUID(), skill, evidence: [], source: "written" };
}

export function newRecognition(): CareerArcRecognition {
  return { id: crypto.randomUUID(), title: "", kind: "other" };
}

export function untitledStories(document: CareerArcDocument): number {
  return (document.roles ?? []).reduce(
    (total, role) => total + (role.stories ?? []).filter((story) => !story.title.trim()).length,
    0,
  );
}

export function incompleteExtras(document: CareerArcDocument): number {
  const strengths = (document.strengths ?? []).filter((strength) => !strength.skill.trim()).length;
  const recognition = (document.recognition ?? []).filter((item) => !item.title.trim()).length;
  return strengths + recognition;
}

/** A strength may only point at stories that exist, so deleting a story takes
 * it out of every strength's evidence. */
export function pruneEvidence(document: CareerArcDocument): CareerArcDocument {
  const ids = new Set(
    (document.roles ?? []).flatMap((role) => (role.stories ?? []).map((s) => s.id)),
  );
  const strengths = document.strengths ?? [];
  if (strengths.every((strength) => (strength.evidence ?? []).every((id) => ids.has(id))))
    return document;
  return {
    ...document,
    strengths: strengths.map((strength) => ({
      ...strength,
      evidence: (strength.evidence ?? []).filter((id) => ids.has(id)),
    })),
  };
}

export function storyOptions(document: CareerArcDocument): { id: string; label: string }[] {
  return (document.roles ?? []).flatMap((role) =>
    (role.stories ?? [])
      .filter((story) => story.title.trim())
      .map((story) => ({
        id: story.id,
        label: [story.title, role.organization].filter(Boolean).join(" · "),
      })),
  );
}

export function matchesSearch(role: CareerArcRole, story: CareerArcStory, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    story.title,
    role.organization,
    role.role,
    ...(story.skills ?? []),
    story.situation,
    story.outcome,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function warningsFor(
  warnings: readonly CareerArcWarning[],
  itemId: string,
): CareerArcWarning[] {
  return warnings.filter((warning) => warning.item_id === itemId);
}

export function describeWarning(warning: CareerArcWarning): string {
  const field = warning.field ? (FIELD_LABELS[warning.field] ?? warning.field) : "A field";
  switch (warning.reason) {
    case "number_not_in_source":
      return `${field}: we couldn't find "${warning.value}" in your document. Confirm it or edit it.`;
    case "trimmed":
      return `${field} was too long and was shortened. Check it.`;
    case "section_failed":
      return `Section ${warning.value} of your document could not be read, so some of it may be missing. Upload it again if something is absent.`;
    case "roles_dropped":
      return `${warning.value} more chapters were left out because the limit is ${CAREER_ARC_LIMITS.roles}.`;
    case "strengths_dropped":
      return `${warning.value} suggested ${warning.value === "1" ? "strength was" : "strengths were"} left out because there was no story to back it.`;
    default:
      return `${warning.value} more stories were left out because of the story limits.`;
  }
}

export function describeProgress(run: Pick<CareerArcParseRun, "stage" | "done" | "total">): string {
  if (run.stage === "checking") return "Checking the details…";
  if (run.total > 0) return `Reading section ${Math.min(run.done + 1, run.total)} of ${run.total}`;
  return "Getting ready…";
}

export function progressFraction(run: Pick<CareerArcParseRun, "stage" | "done" | "total">): number {
  if (run.stage === "checking") return 1;
  return run.total > 0 ? run.done / run.total : 0;
}

/** The backend sentence is shown as written; these only pick the way out. */
export function wantsTemplate(code: string | null): boolean {
  return code === "career_arc_too_long" || code === "career_arc_not_found";
}
