import { DEMO_COMPANIES } from "./ask-companies";
import {
  THINKING,
  NEWS_ROWS,
  createCiter,
  text,
  lowerFirst,
  pick,
  agoInDays,
  plural,
  rowsFor,
  fitQuestion,
  contactChip,
  draftChip,
} from "./ask-answer-parts";
import type { DemoAnswer, DemoCompany, Segment } from "./ask-types";

export function newsAnswer(c: DemoCompany | undefined): DemoAnswer {
  const { sources, cite, index } = createCiter();
  const pool = c ? [c] : DEMO_COMPANIES;
  const items = pool
    .flatMap((co) => co.signals.map((s) => ({ co, s })))
    .sort((a, b) => agoInDays(a.s.ago) - agoInDays(b.s.ago))
    .slice(0, c ? 4 : 5);
  const lead = c ? (c.whyNow ? `${c.whyNow}.` : `Here is what changed at ${c.name}.`) : null;
  const paragraphs: Segment[][] =
    c && !items.length
      ? [
          [
            text(`Nothing new at ${c.name} in the sources I check. `),
            cite(pick(c, ["launch", "home"])),
          ],
        ]
      : [[text(lead ?? "Here's what moved in the last few weeks.", true)]];
  const first = items[0]?.co;
  return {
    thinkingLabel: THINKING,
    scanLabel: c ? `Checking what changed at ${c.name}` : "Checking news across your companies",
    doneLabel: items.length
      ? `${plural(items.length, "signal", "signals")} worth knowing`
      : "Nothing new this month",
    rows: c ? rowsFor(c) : NEWS_ROWS,
    paragraphs,
    timeline: items.map(({ co, s }) => ({
      ago: s.ago,
      company: co.name,
      text: lowerFirst(s.text),
      cite: index(s.source),
    })),
    chips: c
      ? [
          ...contactChip(c),
          ...draftChip(c),
          { label: "Why it fits", icon: "doc", question: fitQuestion(c) },
        ]
      : first
        ? [
            {
              label: "Who should I write to first?",
              icon: "spark",
              question: `Who should I write to at ${first.name}?`,
            },
          ]
        : [],
    sources,
  };
}

export function fitAnswer(c: DemoCompany): DemoAnswer {
  const { sources, cite } = createCiter();
  const lead: Segment[] = [text(`${c.name} is a ${c.fit} fit for you.`, true)];
  if (c.matchedRole)
    lead.push(
      text(` They're hiring a ${c.matchedRole} `),
      cite(pick(c, ["role"])),
      text(", which matches the work you've done. "),
    );
  else lead.push(text(` They build ${lowerFirst(c.tagline)} `), cite(c.sources.home), text(". "));
  if (c.whyNow)
    lead.push(
      text(`${c.whyNow} `),
      cite(pick(c, ["funding", "team", "launch", "hiring"])),
      text("."),
    );
  return {
    thinkingLabel: THINKING,
    scanLabel: `Reading ${c.domain}`,
    doneLabel: `Checked ${Object.keys(c.sources).length + c.signals.length} sources`,
    rows: rowsFor(c),
    paragraphs: [
      lead,
      [
        text(`${c.reasons.stack} `),
        cite(pick(c, ["tech", "role", "home"])),
        text(` ${c.reasons.stage} ${c.reasons.work}`),
      ],
    ],
    chips: [
      ...contactChip(c),
      ...draftChip(c),
      { label: "What changed", icon: "search", question: `What changed at ${c.name} this month?` },
    ],
    sources,
  };
}
