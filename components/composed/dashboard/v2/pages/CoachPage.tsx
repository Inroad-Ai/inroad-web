"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Btn, Hair, Ic, Lm } from "../kit";

// The coach has no backend yet: the questions, what an answer changes, the
// headline and the streak are all sample values kept on this page.

interface Choice {
  label: string;
  /** What picking it changes: the line shown under "What changed". */
  effect: [icon: string, head: string, sub: string];
}

interface Question {
  id: string;
  number: number;
  about: string;
  title: string;
  sub: string;
  choices: Choice[];
  preselected: string[];
  draft: string;
  placeholder: string;
  dictated: string;
}

const QUESTIONS: Question[] = [
  {
    id: "win",
    number: 3,
    about: "about your goals",
    title: "What would make your next role a clear win 18 months from now?",
    sub: "Your answer changes which companies rank first.",
    choices: [
      {
        label: "Technical depth",
        effect: ["trend", 'Weighted "engineering correctness" higher', "3 companies moved up"],
      },
      {
        label: "Leading a small team",
        effect: ["users", "Surfaced team lead openings", "4 roles added"],
      },
      {
        label: "Equity that can matter",
        effect: ["dollar", "Moved early-stage companies up", "2 seed and Series A teams"],
      },
      {
        label: "Shipping to many users",
        effect: ["rocket", "Weighted product reach higher", "5 companies moved up"],
      },
      {
        label: "A mission I believe in",
        effect: ["star", "Started tracking mission signals", "6 companies tagged"],
      },
      {
        label: "Calm, stable work",
        effect: ["shield", "Moved later-stage companies up", "Fewer seed teams shown"],
      },
    ],
    preselected: ["Technical depth", "Equity that can matter"],
    draft:
      "Own the architecture of something that moves real money, with a team that values correctness over speed.",
    placeholder: "In a sentence or two, what does a clear win look like?",
    dictated:
      "I want to own a system people trust, and to be known for getting the hard parts right.",
  },
  {
    id: "team",
    number: 4,
    about: "about how you work",
    title: "What kind of team do you do your best work in?",
    sub: "Your answer changes which teams are suggested first.",
    choices: [
      {
        label: "Small and senior",
        effect: ["users", "Preferred teams under 15 engineers", "3 companies moved up"],
      },
      {
        label: "Fast and scrappy",
        effect: ["zap", "Moved early teams up", "2 seed teams surfaced"],
      },
      {
        label: "Structured and calm",
        effect: ["layers", "Preferred established teams", "4 companies moved up"],
      },
      {
        label: "Remote first",
        effect: ["globe", "Moved remote-first teams up", "7 roles re-ranked"],
      },
      {
        label: "Mentoring-heavy",
        effect: ["book", "Looked for mentoring signals", "3 teams tagged"],
      },
    ],
    preselected: [],
    draft: "",
    placeholder: "Describe the team around you at your best.",
    dictated: "A small senior team that writes things down and reviews each other carefully.",
  },
  {
    id: "trade",
    number: 5,
    about: "about trade-offs",
    title: "What would you give up for the right role?",
    sub: "Your answer changes what gets filtered out.",
    choices: [
      { label: "Some salary", effect: ["dollar", "Widened the salary range", "5 roles added"] },
      { label: "A longer commute", effect: ["pin", "Widened the search area", "3 roles added"] },
      {
        label: "A bigger title",
        effect: ["tag", "Stopped filtering on title level", "6 roles added"],
      },
      {
        label: "Relocating",
        effect: ["globe", "Included roles that need a move", "9 roles added"],
      },
      {
        label: "Nothing, really",
        effect: ["filter", "Kept your filters strict", "No change to the list"],
      },
    ],
    preselected: [],
    draft: "",
    placeholder: "Anything you would trade, and anything you would not.",
    dictated: "I would trade some salary for a better problem, but not remote work.",
  },
];

const EARLIER_CHANGES: [string, string, string][] = [
  ["trend", 'Weighted "engineering correctness" higher', "3 companies moved up"],
  ["eye", "Hid 2 manager-only roles", "You prefer technical depth"],
];

const SUGGESTED_HEADLINE = "Backend engineer who makes money-moving systems correct and boring.";
const SHOWN_CHANGES = 3;

export function CoachPage() {
  const [queue, setQueue] = useState<string[]>(QUESTIONS.map((q) => q.id));
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set(QUESTIONS[0].preselected));
  const [text, setText] = useState(QUESTIONS[0].draft);
  const [changes, setChanges] = useState(EARLIER_CHANGES);
  const [answered, setAnswered] = useState(18);
  const [plan, setPlan] = useState("Become the person teams trust with money-critical systems.");
  const [headline, setHeadline] = useState<"closed" | "open" | "accepted" | "dismissed">("closed");
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = QUESTIONS.find((q) => q.id === queue[0]) ?? null;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function show(nextQueue: string[], message: string) {
    const next = QUESTIONS.find((q) => q.id === nextQueue[0]);
    if (timer.current) clearTimeout(timer.current);
    setListening(false);
    setQueue(nextQueue);
    setPicked(new Set(next?.preselected ?? []));
    setText(next?.draft ?? "");
    setNote(message);
  }

  function toggle(label: string) {
    setNote("");
    setPicked((current) => {
      const copy = new Set(current);
      if (copy.has(label)) copy.delete(label);
      else copy.add(label);
      return copy;
    });
  }

  function save() {
    if (!question) return;
    if (picked.size === 0 && !text.trim()) {
      setNote("Pick an option or write a line first.");
      return;
    }
    const fromPicks = question.choices.filter((c) => picked.has(c.label)).map((c) => c.effect);
    const fresh: [string, string, string][] =
      fromPicks.length > 0
        ? fromPicks
        : [["pen", "Saved your note", "It will shape your next matches"]];
    setChanges((current) => {
      const seen = new Set(fresh.map(([, head]) => head));
      return [...fresh, ...current.filter(([, head]) => !seen.has(head))];
    });
    setAnswered((value) => value + 1);
    if (question.id === "win" && text.trim()) setPlan(text.trim());
    show(queue.slice(1), "Saved. Your matches will use it.");
  }

  function skip() {
    show(queue.slice(1), "Skipped.");
  }

  function later() {
    if (queue.length < 2) {
      setNote("This is the last one, so it stays here for later.");
      return;
    }
    show([...queue.slice(1), queue[0]], "Moved to the end of your list.");
  }

  function dictate() {
    if (!question || listening) return;
    setListening(true);
    setNote("Listening... (voice input is a preview, so a sample sentence is filled in)");
    timer.current = setTimeout(() => {
      setText(question.dictated);
      setListening(false);
      setNote("Sample sentence added. Edit it as you like.");
    }, 1400);
  }

  function restart() {
    show(
      QUESTIONS.map((q) => q.id),
      "",
    );
  }

  return (
    <div className="split" style={{ display: "flex", gap: 56, justifyContent: "space-between" }}>
      <div style={{ flex: 1, maxWidth: 700, marginTop: 28 }}>
        {question ? (
          <>
            <div className="row" style={{ gap: 10 }}>
              <Lm c={3} round>
                <Ic n="spark" size="s" />
              </Lm>
              <span className="sm muted">
                Question {question.number} this week · {question.about} · 30 seconds
              </span>
            </div>
            <h1
              style={{
                fontSize: 36,
                lineHeight: 1.18,
                letterSpacing: "-.04em",
                fontWeight: 600,
                margin: "22px 0 12px",
              }}
            >
              {question.title}
            </h1>
            <div className="sub" style={{ marginTop: 0 }}>
              {question.sub}
            </div>

            <div
              className="row wrap"
              style={{ gap: 10, margin: "26px 0 18px" }}
              role="group"
              aria-label="Quick answers"
            >
              {question.choices.map(({ label }) => {
                const on = picked.has(label);
                return (
                  <button
                    key={label}
                    type="button"
                    className={`pill ${on ? "on" : ""}`}
                    aria-pressed={on}
                    onClick={() => toggle(label)}
                  >
                    {on ? <Ic n="check" size="xs" /> : null}
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="field coach-answer">
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={question.placeholder}
                aria-label="Your answer"
                rows={2}
              />
              <button
                type="button"
                className={listening ? "amber" : "faint"}
                aria-label="Answer by voice"
                aria-pressed={listening}
                onClick={dictate}
              >
                <Ic n="mic" />
              </button>
            </div>

            <div className="row wrap" style={{ gap: 14, marginTop: 22 }}>
              <Btn kind="p lg" icon="check" onClick={save}>
                Save answer
              </Btn>
              <Btn kind="t" onClick={skip}>
                Skip
              </Btn>
              <Btn kind="t" icon="clock" onClick={later}>
                Ask me later
              </Btn>
            </div>
          </>
        ) : (
          <>
            <div className="row" style={{ gap: 10 }}>
              <Lm c={6} round>
                <Ic n="check" size="s" />
              </Lm>
              <span className="sm muted">All caught up</span>
            </div>
            <h1
              style={{
                fontSize: 36,
                lineHeight: 1.18,
                letterSpacing: "-.04em",
                fontWeight: 600,
                margin: "22px 0 12px",
              }}
            >
              That is all for this week.
            </h1>
            <div className="sub" style={{ marginTop: 0 }}>
              New questions arrive next week. Your matches already use what you told the coach.
            </div>
            <div className="row wrap" style={{ gap: 14, marginTop: 24 }}>
              <Btn kind="p" href="/opportunities">
                See your matches
              </Btn>
              <Btn kind="t" icon="history" onClick={restart}>
                Answer again
              </Btn>
            </div>
          </>
        )}

        <p
          className="sm muted"
          style={{ marginTop: 16, minHeight: 20 }}
          role="status"
          aria-live="polite"
        >
          {note}
        </p>
      </div>

      <div
        className="aside"
        style={{
          width: 300,
          paddingLeft: 34,
          borderLeft: "1px solid rgb(var(--color-line))",
          marginTop: 30,
        }}
      >
        <div className="b" style={{ marginBottom: 14 }}>
          What changed from your answers
        </div>
        {changes.slice(0, SHOWN_CHANGES).map(([icon, head, sub]) => (
          <div
            key={head}
            className="row"
            style={{ alignItems: "flex-start", gap: 12, padding: "10px 0" }}
          >
            <span className="teal" style={{ marginTop: 2 }}>
              <Ic n={icon} size="s" />
            </span>
            <div>
              <div className="sm m">{head}</div>
              <div className="xs faint">{sub}</div>
            </div>
          </div>
        ))}

        {headline === "dismissed" ? null : (
          <div className="row" style={{ alignItems: "flex-start", gap: 12, padding: "10px 0" }}>
            <span className="teal" style={{ marginTop: 2 }}>
              <Ic n="pen" size="s" />
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="sm m">
                {headline === "accepted" ? "New headline accepted" : "Suggested a new headline"}
              </div>
              {headline === "closed" ? (
                <button type="button" className="xs amber m" onClick={() => setHeadline("open")}>
                  Review it
                </button>
              ) : (
                <div className="xs faint" style={{ marginTop: 2, lineHeight: 1.5 }}>
                  &quot;{SUGGESTED_HEADLINE}&quot;
                </div>
              )}
              {headline === "open" ? (
                <div className="row" style={{ gap: 8, marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn sm p"
                    onClick={() => setHeadline("accepted")}
                  >
                    Use it
                  </button>
                  <button
                    type="button"
                    className="btn sm t"
                    onClick={() => setHeadline("dismissed")}
                  >
                    Dismiss
                  </button>
                </div>
              ) : null}
              {headline === "accepted" ? (
                <div className="xs faint" style={{ marginTop: 4 }}>
                  Preview only. Copy it into your <Link href="/profile">profile</Link> to keep it.
                </div>
              ) : null}
            </div>
          </div>
        )}

        <Hair my={20} />
        <div className="xs faint">Your plan</div>
        <div className="sm" style={{ marginTop: 6, lineHeight: 1.6 }}>
          &quot;{plan}&quot;
        </div>
        <div className="row" style={{ gap: 10, marginTop: 16 }}>
          <span className="amber">
            <Ic n="flame" size="s" />
          </span>
          <span className="sm">9 day streak · {answered} answered</span>
        </div>
        <p className="xs faint" style={{ marginTop: 18 }}>
          Sample coach: answers stay on this page and reset when you reload.
        </p>
      </div>
    </div>
  );
}
