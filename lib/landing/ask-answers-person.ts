import {
  THINKING,
  createCiter,
  text,
  lowerFirst,
  pick,
  plural,
  fitQuestion,
  draftChip,
} from "./ask-answer-parts";
import type {
  DemoAnswer,
  DemoCompany,
  DemoPerson,
  DemoSource,
  Segment,
  SourceKind,
} from "./ask-types";

export function contactAnswer(c: DemoCompany, p: DemoPerson): DemoAnswer {
  const { sources, cite } = createCiter();
  const role = " They lead the team you'd join, so they can say yes without a queue. ";
  const paragraphs: Segment[][] = [
    [text(`Write to ${p.name}`, true), text(`, ${p.title} at ${c.name}.${role}`), cite(p.foundVia)],
  ];
  if (p.commonGround.length)
    paragraphs.push([
      text(`You have common ground: ${lowerFirst(p.commonGround.join("; "))}. `),
      cite(pick(c, ["tech", "team", "role"])),
    ]);
  return {
    thinkingLabel: THINKING,
    scanLabel: "Looking for the person who can hire you",
    doneLabel: "Found the person who runs the team",
    rows: [
      { name: `Team page · ${c.domain}`, count: 1, unit: "page" },
      { name: "LinkedIn search", count: 12, unit: "profiles" },
      { name: "Apollo.io", count: 1, unit: "lookup" },
    ],
    paragraphs,
    contact: { email: p.email, linkedin: p.linkedin },
    chips: [...draftChip(c), { label: "Open dossier", icon: "doc", question: fitQuestion(c) }],
    sources,
  };
}

export function noContactAnswer(c: DemoCompany): DemoAnswer {
  const { sources, cite } = createCiter();
  return {
    thinkingLabel: THINKING,
    scanLabel: "Looking for the person who can hire you",
    doneLabel: "No one verified yet",
    rows: [
      { name: `Team page · ${c.domain}`, count: 0, unit: "pages" },
      { name: "LinkedIn search", count: 4, unit: "profiles" },
      { name: "Apollo.io", count: 0, unit: "lookups" },
    ],
    paragraphs: [
      [
        text(`I haven't found someone at ${c.name} I can verify yet.`, true),
        text(" I won't guess at a name or an email. What I can back up is what they do "),
        cite(c.sources.home),
        text("."),
      ],
    ],
    chips: [{ label: "Why it fits", icon: "doc", question: fitQuestion(c) }],
    sources,
  };
}

export function draftAnswer(c: DemoCompany, p: DemoPerson): DemoAnswer {
  const { sources, index } = createCiter();
  const kinds: SourceKind[] = ["role", "funding", "team", "tech", "hiring", "launch", "home"];
  const facts = kinds
    .map((k) => c.sources[k])
    .filter((s): s is DemoSource => s !== undefined)
    .slice(0, 3)
    .map(index);
  return {
    thinkingLabel: `Writing from ${plural(facts.length, "sourced fact", "sourced facts")}…`,
    scanLabel: "",
    doneLabel: `Draft to ${p.name}, ${p.title}`,
    rows: [],
    paragraphs: [
      [
        text(`Here's a first draft to ${p.name}.`, true),
        text(" Every fact in it links to where I found it."),
      ],
    ],
    draft: { person: p, subject: p.draft.subject, body: p.draft.body, facts },
    chips: [],
    sources,
  };
}
