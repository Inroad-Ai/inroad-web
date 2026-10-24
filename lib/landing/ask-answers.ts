import { DEMO_COMPANIES, findDemoCompany } from "./ask-companies";
import { DEMO_PEOPLE, primaryContactAt } from "./ask-people";
import { fallbackAnswer, listAnswer } from "./ask-answers-market";
import { fitAnswer, newsAnswer } from "./ask-answers-company";
import { contactAnswer, draftAnswer, noContactAnswer } from "./ask-answers-person";
import type { DemoAnswer, DemoCompany } from "./ask-types";

function resolveCompany(question: string): DemoCompany | undefined {
  const q = question.toLowerCase();
  const person = DEMO_PEOPLE.find((p) => q.includes(p.name.split(" ")[0].toLowerCase()));
  return findDemoCompany(question) ?? DEMO_COMPANIES.find((c) => c.id === person?.companyId);
}

/** Matches a question to a canned, sourced answer by keyword. Anything it
 * can't match gets an honest fallback rather than a made-up answer. */
export function answerFor(question: string): DemoAnswer {
  const q = ` ${question.toLowerCase()} `;
  const has = (...words: string[]) => words.some((w) => q.includes(w));
  const company = resolveCompany(question);
  const person = primaryContactAt(company?.id ?? DEMO_COMPANIES[0].id);
  const target = company ?? DEMO_COMPANIES[0];

  const wantsContact = has(
    "who ",
    "contact",
    "hire me",
    "hiring manager",
    "reach",
    "person",
    "talk to",
  );
  const wantsDraft = has(
    "draft",
    "write to",
    "write a",
    "email to",
    "follow-up",
    "follow up",
    "message",
  );
  if ((wantsContact || wantsDraft) && !person) return noContactAnswer(target);
  if (person && wantsContact) return contactAnswer(target, person);
  if (person && wantsDraft) return draftAnswer(target, person);
  if (
    has(
      "changed",
      "news",
      "funding",
      "raised",
      "why now",
      "new at",
      "happening",
      "signal",
      "this month",
      "recent",
    )
  )
    return newsAnswer(company);
  if (company) return fitAnswer(company);

  const wantsRemote = has("remote");
  const wantsGo = /\bgo\b|golang/.test(q);
  if (
    wantsRemote ||
    wantsGo ||
    has(
      "berlin",
      "fintech",
      "series",
      "find",
      "companies",
      "match",
      "fit",
      "teams",
      "startups",
      "which",
      "best",
    )
  ) {
    const focus = [wantsRemote ? "remote-friendly" : "", wantsGo ? "Go" : ""]
      .filter(Boolean)
      .join(" ");
    return listAnswer(
      (c) =>
        (!wantsRemote || c.reasons.work.toLowerCase().includes("remote")) &&
        (!wantsGo || c.stack.includes("Go")),
      focus || "infrastructure",
    );
  }
  return fallbackAnswer();
}
