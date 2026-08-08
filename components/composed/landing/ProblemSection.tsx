export function ProblemSection() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <h2 className="font-mono text-2xl text-ink sm:text-3xl">
          The application black hole
        </h2>

        <div className="mt-6 max-w-2xl space-y-4 font-sans text-base leading-relaxed text-text-secondary sm:text-lg">
          <p>
            You spend an hour finding a company that actually fits, another
            hour digging through their About page and news for something
            worth mentioning, then send a message that still sounds like
            everyone else&apos;s. Then nothing. Not a rejection, not a reply,
            just silence, and no way to tell if the message even got read.
          </p>
          <p>
            I built Inroad because I was doing exactly that by hand, for my
            own job search, and got tired of watching the research
            disappear into a message I&apos;d never reuse.
          </p>
        </div>
      </div>
    </section>
  );
}
