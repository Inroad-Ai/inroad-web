/** The six chapters of "the story of one email". `start` is where each one
 * begins as a fraction of the pinned scroll; the field ones drive the node
 * canvas. Jordan, Ledgerline and Priya are sample characters. */
export interface StoryChapter {
  id: string;
  kicker: string;
  title: string;
  copy: string;
  rail: string;
  start: number;
}

export const STORY_CHAPTERS: readonly StoryChapter[] = [
  {
    id: "you",
    kicker: "Chapter one",
    title: "You.",
    copy: "One profile. Six years of work, the stack you know, the kind of team you want to join. Everything Inroad does starts from here, not from a job board.",
    rail: "You",
    start: 0,
  },
  {
    id: "market",
    kicker: "Chapter two",
    title: "Out there: 4,812 companies.",
    copy: "Inroad reads every one against your profile: the role, the stack, the stage, how they work. Most don't fit. That's the point.",
    rail: "4,812 companies",
    start: 0.14,
  },
  {
    id: "company",
    kicker: "Chapter three",
    title: "One of them is Ledgerline.",
    copy: "Inroad reads their homepage, their news and their careers page, then keeps only what's true and useful. Every fact links back to where it came from.",
    rail: "Ledgerline",
    start: 0.37,
  },
  {
    id: "person",
    kicker: "Chapter four",
    title: "Someone there can hire you.",
    copy: "Not a careers inbox. The person who runs the team you'd join, with a verified email and the things you actually have in common.",
    rail: "The person",
    start: 0.55,
  },
  {
    id: "email",
    kicker: "Chapter five",
    title: "Say something worth reading.",
    copy: "The draft is built from what Inroad found and what you've done. The highlighted lines are the homework. Change any word you like.",
    rail: "The email",
    start: 0.69,
  },
  {
    id: "sent",
    kicker: "Chapter six",
    title: "Sent. From you.",
    copy: "Inroad never sends anything on its own. You read it, change what you want, and press Send in your own Gmail. Priya sees a note from Jordan, not from a tool.",
    rail: "Sent",
    start: 0.88,
  },
];

export const MARKET_SIZE = 4812;
export const FIT_COUNT = 12;

export const chapterEnd = (index: number): number => STORY_CHAPTERS[index + 1]?.start ?? 1;

export function chapterAt(progress: number): number {
  let active = 0;
  STORY_CHAPTERS.forEach((chapter, i) => {
    if (progress >= chapter.start) active = i;
  });
  return active;
}

/** How far through chapter `index` the story is, 0 to 1. */
export function chapterProgress(progress: number, index: number): number {
  const start = STORY_CHAPTERS[index].start;
  return Math.min(1, Math.max(0, (progress - start) / (chapterEnd(index) - start)));
}

export interface MailSegment {
  text: string;
  mark?: boolean;
}

export const STORY_MAIL = {
  to: "Priya Natarajan",
  subject: "Your ledger platform team, and a reconciliation rebuild I just did",
  paragraphs: [
    [{ text: "Hi Priya," }],
    [
      { text: "Congrats on the" },
      { text: "Series B.", mark: true },
      { text: "The line about putting the money into a" },
      { text: "ledger platform team", mark: true },
      {
        text: "first caught my eye, because that is the exact system I've spent the last three years on.",
      },
    ],
    [
      {
        text: "At Payvault I led the rebuild of our ledger service in Go and took reconciliation from 6 hours to 11 minutes. Your post on",
      },
      { text: "moving the write path to Go", mark: true },
      { text: "reads like our own postmortem." },
    ],
    [{ text: "Would you be open to a 20-minute call next week?" }],
    [{ text: "Best, Jordan" }],
  ] as readonly (readonly MailSegment[])[],
};
