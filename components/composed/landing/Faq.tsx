const FAQS = [
  {
    question: "How is this different from Simplify or a job board?",
    answer:
      "Job boards get you into a queue behind a thousand other applicants and an ATS filter. Inroad skips the queue: it researches a company and helps you send a message straight to someone there, backed by specifics that show you didn't mass-apply.",
  },
  {
    question: "Do you send emails automatically?",
    answer:
      "No, not yet. Every message Inroad drafts is something you read, edit, and send yourself. Nothing goes out on your behalf.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Your data sits in our own Postgres database, and every query that reads it is scoped to your account, so it's not readable by other users. Resumes are parsed and discarded, never stored as files. Inroad is early: treat it accordingly, and don't put anything in it you wouldn't want stored anywhere new.",
  },
  {
    question: "Is it free?",
    answer:
      "Free during early access. Pricing will come later, once there's a version of the product worth charging for.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">
          Questions
        </h2>

        <div className="mt-10 divide-y divide-line border-y border-line sm:mt-14">
          {FAQS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base text-ink marker:content-none sm:text-lg">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 font-display text-signal-teal transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-text-secondary sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
