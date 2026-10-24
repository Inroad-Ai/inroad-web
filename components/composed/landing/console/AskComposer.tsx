"use client";

import type { FormEvent } from "react";

import { ArrowUpIcon, SparkIcon } from "@/components/ui/Icons";

const SUGGESTIONS = [
  "Why does Ledgerline fit me?",
  "Who should I write to at Tessellate?",
  "What changed at Gridlight this month?",
  "Which remote teams use Go?",
] as const;

const MAX_QUESTION_LENGTH = 160;

/** Suggestions, the question box and the sample-data note. */
export function AskComposer({
  value,
  sendPressed,
  onChange,
  onFocus,
  onAsk,
}: {
  value: string;
  sendPressed: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
  onAsk: (question: string) => void;
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAsk(value);
  };

  return (
    <div className="px-2.5 pb-3 pt-2.5 sm:px-5 sm:pb-4 sm:pt-3">
      <div className="flex gap-1.5 overflow-x-auto pb-2.5 mask-fade-x scrollbar-none">
        {SUGGESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onAsk(question)}
            className="h-8 shrink-0 rounded-full border border-dashed border-ink/25 px-3 text-xs text-ink-muted transition-colors duration-fast hover:border-solid hover:bg-ink/5 hover:text-ink"
          >
            {question}
          </button>
        ))}
      </div>
      <form
        onSubmit={submit}
        autoComplete="off"
        className="flex items-center gap-2 rounded-card border border-ink/15 bg-surface py-1.5 pl-4 pr-1.5 shadow-nest transition duration-fast focus-within:border-signal-amber focus-within:ring-4 focus-within:ring-signal-amber/15"
      >
        <span className="text-signal-teal">
          <SparkIcon />
        </span>
        <label htmlFor="ask-input" className="sr-only">
          Ask Inroad
        </label>
        <input
          id="ask-input"
          type="text"
          value={value}
          maxLength={MAX_QUESTION_LENGTH}
          placeholder="Ask anything about a company…"
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className="h-10 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-faint focus-visible:outline-none"
        />
        <button
          type="submit"
          aria-label="Ask"
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-nest bg-ink text-paper transition duration-fast hover:-translate-y-px ${
            sendPressed ? "scale-90" : ""
          }`}
        >
          <ArrowUpIcon />
        </button>
      </form>
      <div className="utility-label mt-2 flex justify-between gap-2.5 text-ink-faint">
        <span>Try your own question</span>
        <span className="text-right">Sample data · answers cite sources</span>
      </div>
    </div>
  );
}
