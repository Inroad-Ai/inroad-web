const STEPS = [
  {
    heading: "Find companies that actually fit what you want.",
    detail:
      "Tell Inroad what you're looking for and it surfaces companies worth pursuing, not a generic list of everyone hiring.",
  },
  {
    heading: "Research the details worth mentioning, fast.",
    detail:
      "Funding, team, tech stack, recent news, the specific thing that shows you did the homework, pulled together in minutes instead of an afternoon.",
  },
  {
    heading: "Send outreach that sounds like you, not a template.",
    detail:
      "Draft a message built on the research, not a mail-merge. You read it, edit it, and send it, nothing goes out without you.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">
          How it works
        </h2>

        <ol className="mt-10 grid gap-10 sm:mt-14 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.heading} className="relative">
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-3 hidden h-px w-full translate-x-[calc(100%+1rem)] bg-line sm:block"
                />
              ) : null}
              <span className="utility-label text-signal-teal">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg leading-snug text-ink sm:text-xl">
                {step.heading}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-text-secondary sm:text-base">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
