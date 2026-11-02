"use client";

import { RESEARCH_STEPS } from "@/lib/api-client/client";
import { CheckCircleIcon, SpinnerIcon } from "@/components/ui/Icons";
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import type { ResearchRun } from "@/lib/research-runs";

import { RESEARCH_STEP_COPY } from "./research-progress";

/** The live timeline of one research run: each step the backend reports,
 * running or done with what it found. */
export function ResearchSteps({ run }: { run: ResearchRun }) {
  const elapsed = useElapsedSeconds(run.startedAt);

  return (
    <div className="rounded-nest bg-surface-raised p-5" role="status" aria-live="polite">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-sans-semibold text-ink">
          Researching <span className="font-mono">{run.domain}</span>
        </p>
        <span aria-hidden className="font-mono text-xs text-ink-muted tabular-nums">
          {elapsed}s
        </span>
      </div>
      <ol className="mt-4 flex flex-col">
        {RESEARCH_STEPS.map((step, index) => {
          const state = run.steps[step];
          const copy = RESEARCH_STEP_COPY[step];
          const last = index === RESEARCH_STEPS.length - 1;
          return (
            <li key={step} className="flex gap-3">
              <span className="flex flex-col items-center">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {state?.status === "done" ? (
                    <span className="inline-flex text-signal-teal motion-safe:animate-fade-up">
                      <CheckCircleIcon />
                    </span>
                  ) : state?.status === "running" ? (
                    <span className="inline-flex text-signal-amber">
                      <SpinnerIcon />
                    </span>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-ink/20" />
                  )}
                </span>
                {!last ? (
                  <span
                    aria-hidden
                    className={`my-1 w-px flex-1 transition-colors duration-base ${
                      state?.status === "done" ? "bg-signal-teal" : "bg-line"
                    }`}
                  />
                ) : null}
              </span>
              <p
                className={`pb-4 text-sm transition-colors duration-base ${
                  state ? "text-ink" : "text-ink-faint"
                } ${state?.status === "running" ? "font-sans-semibold" : ""}`}
              >
                {state?.status === "done" ? copy.done(state.count) : copy.running}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
