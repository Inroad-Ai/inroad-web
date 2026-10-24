import { DEMO_COMPANIES } from "./ask-companies";
import {
  THINKING,
  MARKET_ROWS,
  createCiter,
  text,
  pick,
  plural,
  fitQuestion,
  contactChip,
  draftChip,
} from "./ask-answer-parts";
import type { DemoAnswer, DemoCompany, Segment } from "./ask-types";

export function listAnswer(filter: (c: DemoCompany) => boolean, focus: string): DemoAnswer {
  const { sources, cite, index } = createCiter();
  const list = DEMO_COMPANIES.filter(filter).slice(0, 6);
  const [first, second, third] = list;
  const lead: Segment[] = first
    ? [text(`${first.name} is the clearest.`, true)]
    : [text("No companies matched that yet.")];
  if (first?.matchedRole)
    lead.push(
      text(` They're hiring a ${first.matchedRole} `),
      cite(pick(first, ["role"])),
      text(". "),
    );
  if (first?.whyNow)
    lead.push(
      text(`${first.whyNow} `),
      cite(pick(first, ["funding", "launch", "hiring"])),
      text(". "),
    );
  if (second) {
    const names = third
      ? `${second.name} and ${third.name} follow, both hiring`
      : `${second.name} follows, hiring`;
    lead.push(
      text(`${names} for ${focus} work you've done in production `),
      cite(pick(second, ["hiring", "role"])),
      text("."),
    );
  }
  return {
    thinkingLabel: THINKING,
    scanLabel: "Scanning 2,400 companies",
    doneLabel: "Read 4,502 pages in 2.8 s",
    rows: MARKET_ROWS,
    title: plural(list.length, "strong fit", "strong fits"),
    paragraphs: [lead],
    cards: list.map((c) => ({
      company: c,
      why: c.reasons.role,
      cite: index(pick(c, ["role", "funding", "hiring", "launch", "home"])),
    })),
    chips: first
      ? [
          { label: "Research", icon: "search", question: fitQuestion(first) },
          ...contactChip(first),
          ...draftChip(first),
        ]
      : [],
    sources,
  };
}

export function fallbackAnswer(): DemoAnswer {
  const { sources, cite, index } = createCiter();
  const closest = DEMO_COMPANIES.slice(0, 3);
  return {
    thinkingLabel: THINKING,
    scanLabel: "Searching your profile and 3 sources",
    doneLabel: "No exact match, 3 close ones",
    rows: MARKET_ROWS,
    title: "Closest I can back up",
    paragraphs: [
      [
        text("I don't have a sourced answer for that yet.", true),
        text(
          ` This preview only knows ${DEMO_COMPANIES.length} sample companies, and I won't guess. Here's the closest thing I can back up with a link `,
        ),
        cite(pick(closest[0], ["role", "home"])),
        text("."),
      ],
    ],
    cards: closest.map((c) => ({
      company: c,
      why: c.reasons.role,
      cite: index(pick(c, ["role", "home"])),
    })),
    chips: [
      {
        label: "Why does Ledgerline fit me?",
        icon: "spark",
        question: "Why does Ledgerline fit me?",
      },
      {
        label: "What changed this month?",
        icon: "spark",
        question: "What changed at my companies this month?",
      },
    ],
    sources,
  };
}
