"use client";

import { useState } from "react";

import { Btn, Hair, Ic, Lm } from "../kit";

interface Question {
  about: string;
  title: string;
  choices: string[];
  placeholder: string;
}

const QUESTIONS: Question[] = [
  {
    about: "about your goals",
    title: "What would make your next role a clear win 18 months from now?",
    choices: [
      "Technical depth",
      "Leading a small team",
      "Equity that can matter",
      "Shipping to many users",
      "A mission I believe in",
      "Calm, stable work",
    ],
    placeholder: "In a sentence or two, what does a clear win look like?",
  },
  {
    about: "about how you work",
    title: "What kind of team do you do your best work in?",
    choices: [
      "Small and senior",
      "Fast and scrappy",
      "Structured and calm",
      "Remote first",
      "Mentoring-heavy",
    ],
    placeholder: "Describe the team around you at your best.",
  },
  {
    about: "about trade-offs",
    title: "What would you give up for the right role?",
    choices: ["Some salary", "A longer commute", "A bigger title", "Relocating", "Nothing, really"],
    placeholder: "Anything you would trade, and anything you would not.",
  },
];

const CHANGES: [string, string, string][] = [
  ["trend", 'Weighted "engineering correctness" higher', "3 companies moved up"],
  ["eye", "Hid 2 manager-only roles", "You prefer technical depth"],
  ["pen", "Suggested a new headline", "Review it"],
];

export function CoachPage() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<ReadonlySet<string>>(
    new Set(["Technical depth", "Equity that can matter"]),
  );
  const [text, setText] = useState(
    "Own the architecture of something that moves real money, with a team that values correctness over speed.",
  );
  const [answered, setAnswered] = useState(18);
  const [note, setNote] = useState("");
  const question = QUESTIONS[index % QUESTIONS.length];

  function next(message: string) {
    setIndex((value) => value + 1);
    setPicked(new Set());
    setText("");
    setNote(message);
  }

  function toggle(choice: string) {
    setPicked((current) => {
      const copy = new Set(current);
      if (copy.has(choice)) copy.delete(choice);
      else copy.add(choice);
      return copy;
    });
  }

  function save() {
    if (picked.size === 0 && !text.trim()) {
      setNote("Pick an option or write a line first.");
      return;
    }
    setAnswered((value) => value + 1);
    next("Saved. Your matches will use it.");
  }

  return (
    <div className="split" style={{ display: "flex", gap: 56, justifyContent: "space-between" }}>
      <div style={{ flex: 1, maxWidth: 700, marginTop: 28 }}>
        <div className="row" style={{ gap: 10 }}>
          <Lm c={3} round>
            <Ic n="spark" size="s" />
          </Lm>
          <span className="sm muted">
            Question {(index % QUESTIONS.length) + 3} this week · {question.about} · 30 seconds
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
          Your answer changes which companies rank first.
        </div>

        <div
          className="row wrap"
          style={{ gap: 10, margin: "26px 0 18px" }}
          role="group"
          aria-label="Quick answers"
        >
          {question.choices.map((choice) => {
            const on = picked.has(choice);
            return (
              <button
                key={choice}
                type="button"
                className={`pill ${on ? "on" : ""}`}
                aria-pressed={on}
                onClick={() => toggle(choice)}
              >
                {on ? <Ic n="check" size="xs" /> : null}
                {choice}
              </button>
            );
          })}
        </div>

        <label
          className="field"
          style={{
            height: "auto",
            minHeight: 60,
            padding: 16,
            whiteSpace: "normal",
            alignItems: "flex-start",
          }}
        >
          <span className="sr-only">Your answer</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={question.placeholder}
            rows={3}
            style={{
              flex: 1,
              minWidth: 0,
              background: "none",
              border: 0,
              outline: 0,
              resize: "vertical",
              color: "rgb(var(--color-ink))",
              font: "inherit",
              fontSize: 15.5,
              lineHeight: 1.55,
            }}
          />
        </label>

        <div className="row wrap" style={{ gap: 14, marginTop: 22 }}>
          <Btn kind="p lg" icon="check" onClick={save}>
            Save answer
          </Btn>
          <Btn kind="t" onClick={() => next("Skipped.")}>
            Skip
          </Btn>
          <Btn kind="t" icon="clock" onClick={() => next("We will ask again tomorrow.")}>
            Ask me later
          </Btn>
          <span className="sm muted" role="status" aria-live="polite">
            {note}
          </span>
        </div>
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
        {CHANGES.map(([icon, head, sub]) => (
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
        <Hair my={20} />
        <div className="xs faint">Your plan</div>
        <div className="sm" style={{ marginTop: 6, lineHeight: 1.6 }}>
          &quot;Become the person teams trust with money-critical systems.&quot;
        </div>
        <div className="row" style={{ gap: 10, marginTop: 16 }}>
          <span className="amber">
            <Ic n="flame" size="s" />
          </span>
          <span className="sm">9 day streak · {answered} answered</span>
        </div>
      </div>
    </div>
  );
}
