const STEPS = [
  { label: "Initial", date: "Oct 20", state: "done" },
  { label: "Follow-up 1", date: "Oct 24", state: "done" },
  { label: "Priya replied", date: "Oct 25", state: "stop" },
  { label: "Follow-up 2", date: "not sent", state: "skip" },
  { label: "Follow-up 3", date: "not sent", state: "skip" },
  { label: "Follow-up 4", date: "not sent", state: "skip" },
] as const;

const DOTS = {
  done: "border-signal-teal bg-signal-teal",
  stop: "border-signal-amber bg-signal-amber",
  skip: "border-ink/20 bg-surface",
} as const;

/** A follow-up sequence that ended the day the reply came in. */
export function CadenceMini() {
  return (
    <ol className="flex overflow-x-auto px-1 pb-1.5 pt-4 scrollbar-none">
      {STEPS.map((step, i) => (
        <li
          key={step.label}
          className={`relative grid min-w-28 justify-items-center gap-2 text-center text-xs font-sans-semibold text-ink-muted ${
            step.state === "skip" ? "line-through opacity-40" : ""
          }`}
        >
          {i > 0 ? (
            <span aria-hidden className="absolute -left-1/2 top-2.5 h-0.5 w-full bg-ink/15" />
          ) : null}
          <span
            aria-hidden
            className={`relative h-5 w-5 rounded-full border-2 ${DOTS[step.state]}`}
          />
          {step.label}
          <small className="font-sans-medium text-ink-muted">{step.date}</small>
        </li>
      ))}
    </ol>
  );
}
