"use client";

import { useState } from "react";

import { Btn, Ic, Section } from "../kit";

const STEPS: [string, "done" | "now" | ""][] = [
  ["Profile imported", "done"],
  ["What you want", "now"],
  ["Research runs", ""],
  ["Your matches", ""],
];

const GOALS: [string, boolean][] = [
  ["Land a full-time role", true],
  ["Find contract work", false],
  ["Switch industry", false],
  ["Move countries", true],
  ["Grow into leadership", false],
];

const PLACES: [string, boolean][] = [
  ["Remote, worldwide", true],
  ["Europe", true],
  ["UK", false],
  ["US", false],
  ["Relocate with visa", true],
];

const TEMPLATES = [
  ["zap", "Funded startups hiring backend engineers", "Europe · visa support · Series A to C"],
  ["code", "Open-source friendly teams hiring Python", "Remote · contributes to open source"],
  ["eye", "Stealth startups in fintech", "Seed stage · founded in the last 18 months"],
];

const QUESTION = {
  fontSize: 21,
  fontWeight: 600,
  letterSpacing: "-.025em",
  marginBottom: 14,
} as const;

function Choices({
  options,
  picked,
  onToggle,
}: {
  options: [string, boolean][];
  picked: ReadonlySet<string>;
  onToggle: (label: string) => void;
}) {
  return (
    <>
      {options.map(([label]) => {
        const on = picked.has(label);
        return (
          <button
            key={label}
            type="button"
            className={`pill ${on ? "on" : ""}`}
            aria-pressed={on}
            onClick={() => onToggle(label)}
          >
            {on ? <Ic n="check" size="xs" /> : null}
            {label}
          </button>
        );
      })}
    </>
  );
}

function toggled(set: ReadonlySet<string>, label: string): ReadonlySet<string> {
  const next = new Set(set);
  if (next.has(label)) next.delete(label);
  else next.add(label);
  return next;
}

export function TodayFirstRunPage({ name }: { name?: string | null }) {
  const [goals, setGoals] = useState<ReadonlySet<string>>(
    new Set(GOALS.filter(([, on]) => on).map(([label]) => label)),
  );
  const [places, setPlaces] = useState<ReadonlySet<string>>(
    new Set(PLACES.filter(([, on]) => on).map(([label]) => label)),
  );

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="muted sm" style={{ marginBottom: 10 }}>
        {name ? `Welcome, ${name}` : "Welcome"}
      </div>
      <h1 className="t" style={{ fontSize: 40 }}>
        Let&apos;s find your first inroad.
      </h1>
      <div className="sub">
        Two quick answers and Inroad starts researching for you. Stop any time and pick up here.
      </div>

      <div className="row wrap" style={{ gap: 0, margin: "30px 0 40px", fontSize: 13.5 }}>
        {STEPS.map(([label, state], i) => (
          <div key={label} className="row" style={{ gap: 0 }}>
            {i ? (
              <span
                style={{
                  height: 1,
                  background: "rgb(var(--color-line))",
                  margin: "0 12px",
                  width: 40,
                }}
              />
            ) : null}
            <span
              className="row"
              style={{
                gap: 8,
                color:
                  state === "now"
                    ? "rgb(var(--color-ink))"
                    : state === "done"
                      ? "rgb(var(--color-ink-muted))"
                      : "rgb(var(--color-ink-faint))",
              }}
            >
              {state === "done" ? (
                <span className="green">
                  <Ic n="check" size="s" />
                </span>
              ) : (
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    ...(state === "now"
                      ? {
                          background: "rgb(var(--color-signal-amber))",
                          color: "rgb(var(--color-on-amber))",
                        }
                      : { boxShadow: "inset 0 0 0 1px rgb(var(--color-line))" }),
                  }}
                >
                  {i + 1}
                </span>
              )}
              <span className={state === "now" ? "m" : ""}>{label}</span>
            </span>
          </div>
        ))}
      </div>

      <div style={QUESTION}>What&apos;s your main goal for the next 6 months?</div>
      <div className="row wrap" style={{ gap: 10, marginBottom: 34 }}>
        <Choices
          options={GOALS}
          picked={goals}
          onToggle={(label) => setGoals((c) => toggled(c, label))}
        />
      </div>
      <div style={QUESTION}>Where could you work?</div>
      <div className="row wrap" style={{ gap: 10 }}>
        <Choices
          options={PLACES}
          picked={places}
          onToggle={(label) => setPlaces((c) => toggled(c, label))}
        />
      </div>

      <div className="row wrap" style={{ gap: 16, marginTop: 36 }}>
        <Btn kind="p lg" icon="arrow" end href="/research">
          Save and find companies
        </Btn>
        <span className="muted sm">Takes about 30 seconds</span>
        <span className="sp" />
        <Btn kind="t" href="/overview">
          Skip for now
        </Btn>
      </div>

      <Section title="Or start from a ready-made search" style={{ marginTop: 56 }}>
        <div className="list">
          {TEMPLATES.map(([icon, title, meta]) => (
            <div key={title}>
              <span className="muted">
                <Ic n={icon} size="s" />
              </span>
              <div>
                <div className="m">{title}</div>
                <div className="xs faint" style={{ marginTop: 2 }}>
                  {meta}
                </div>
              </div>
              <span className="sp" />
              <span className="faint">
                <Ic n="chev" size="s" />
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
