"use client";

import { Reveal } from "@/components/ui/Reveal";

const COMPARISON = [
  ["Starting point", "A vacancy", "A company worth knowing"],
  ["What you receive", "A place in a queue", "Context for a real message"],
  ["How it feels", "Apply, then wait", "Research, decide, reach out"],
  ["Who sends", "A system on your behalf", "You, with the final word"],
] as const;

export function Differentiation() {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl" offset={18} duration={0.55}>
          <p className="utility-label text-signal-teal">A different lane</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">
            Not another way <span className="text-signal-amber">to apply faster.</span>
          </h2>
        </Reveal>

        <Reveal className="mt-12 overflow-hidden rounded-lg border border-line" offset={24} duration={0.65} delay={0.1}>
          <div className="grid grid-cols-[minmax(7rem,0.75fr)_minmax(8rem,1fr)_minmax(8rem,1fr)] border-b border-line bg-paper text-sm sm:grid-cols-[minmax(11rem,0.85fr)_minmax(12rem,1fr)_minmax(12rem,1fr)]">
            <div className="p-4 sm:p-5" />
            <div className="border-l border-line p-4 font-display font-semibold text-text-secondary sm:p-5">Job board</div>
            <div className="border-l border-line bg-signal-teal-subtle/45 p-4 font-display font-semibold text-signal-teal sm:p-5">Inroad</div>
          </div>
          {COMPARISON.map(([label, board, inroad], index) => (
            <Reveal
              key={label}
              className="grid grid-cols-[minmax(7rem,0.75fr)_minmax(8rem,1fr)_minmax(8rem,1fr)] border-b border-line last:border-b-0 sm:grid-cols-[minmax(11rem,0.85fr)_minmax(12rem,1fr)_minmax(12rem,1fr)]"
              offset={0}
              duration={0.4}
              delay={0.16 + index * 0.08}
            >
              <div className="p-4 text-xs font-medium uppercase tracking-[0.08em] text-text-secondary sm:p-5 sm:text-sm sm:normal-case sm:tracking-normal">{label}</div>
              <div className="border-l border-line p-4 text-xs leading-relaxed text-text-secondary sm:p-5 sm:text-sm">{board}</div>
              <div className="border-l border-line bg-signal-teal-subtle/25 p-4 text-xs font-medium leading-relaxed text-ink sm:p-5 sm:text-sm">{inroad}</div>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
