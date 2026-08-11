const SOURCES = [
  {
    code: "SOURCE_01",
    name: "Homepage",
    line: "How the company describes itself today, in its own words — so your first line quotes their positioning instead of guessing at it.",
  },
  {
    code: "SOURCE_02",
    name: "News",
    line: "Recent headlines about them, newest first — so you know about the funding round or the layoffs before you write, not after they reply.",
  },
  {
    code: "SOURCE_03",
    name: "Hiring signal",
    line: "Which roles they have open right now — the clearest public sign of where they are spending, and the easiest thing to reference honestly.",
  },
];

export function SourcesSection() {
  return (
    <section id="sources" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <p className="utility-label text-text-secondary">What each run gives you</p>

        <div className="mt-10 grid gap-10 sm:mt-14 md:grid-cols-3 md:gap-8">
          {SOURCES.map((source) => (
            <div
              key={source.code}
              className="rounded-md border border-line bg-surface p-6 shadow-card"
            >
              <span className="utility-label text-signal-teal">
                {source.code}
              </span>
              <h3 className="mt-3 font-display text-xl text-ink">
                {source.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {source.line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
