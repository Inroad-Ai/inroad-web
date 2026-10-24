import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { COMPARISON, NEW_LOOP, OLD_LOOP, PRODUCT_FACTS } from "@/lib/landing/landing-copy";

import { LandingSection } from "./LandingSection";
import { SectionHeading } from "./SectionHeading";

function Loop({
  kicker,
  title,
  steps,
  isNew,
}: {
  kicker: string;
  title: string;
  steps: readonly string[];
  isNew: boolean;
}) {
  return (
    <Card padding="lg" className="relative overflow-hidden">
      {isNew ? <div aria-hidden className="absolute inset-0 bg-signal-amber/5" /> : null}
      <div className="relative">
        <Eyebrow className="mb-3">{kicker}</Eyebrow>
        <h3 className="mb-4 text-2xl font-sans-semibold tracking-heading text-ink">{title}</h3>
        <ol className="grid gap-2.5">
          {steps.map((step, i) => (
            <li
              key={step}
              className={`flex items-center gap-3 font-sans-semibold ${
                isNew ? "text-ink-muted" : "text-ink-faint line-through decoration-muted-rose"
              }`}
            >
              <span
                aria-hidden
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-2xs font-sans-bold no-underline ${
                  isNew
                    ? "border-signal-amber bg-signal-amber text-on-amber"
                    : "border-ink/20 text-ink-muted"
                }`}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

/** What the product does every time, and how it differs from a job board.
 * Deliberately no outcome metrics until there is real data behind them. */
export function Results() {
  return (
    <LandingSection>
      <SectionHeading
        kicker="What you can count on"
        lines={[{ text: "Fewer messages. Better ones." }]}
        lede="No cohort numbers to show you yet. These are the things Inroad does every single time."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
        {PRODUCT_FACTS.map((fact, i) => (
          <Reveal key={fact.label} delay={(i % 4) * 0.08}>
            <Card padding="lg" className="h-full">
              <b className="block font-display text-section font-sans-semibold tracking-display text-ink">
                {fact.value}
              </b>
              <span className="mt-3 block text-sm font-sans-semibold text-ink-muted">
                {fact.label}
              </span>
            </Card>
          </Reveal>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-2 md:gap-5">
        <Loop kicker="Before" title="The old loop" steps={OLD_LOOP} isNew={false} />
        <Loop kicker="With Inroad" title="The new one" steps={NEW_LOOP} isNew />
      </div>
      <Card padding="none" className="mt-4 overflow-hidden py-2 md:mt-5">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Job boards compared with Inroad</caption>
          <thead>
            <tr className="utility-label text-ink">
              <td className="hidden px-6 py-4 sm:table-cell" />
              <th scope="col" className="px-4 py-4 sm:px-6">
                Job boards
              </th>
              <th scope="col" className="px-4 py-4 sm:px-6">
                Inroad
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map(([label, board, inroad]) => (
              <tr key={label} className="border-t border-line align-top font-sans-semibold">
                <th
                  scope="row"
                  className="utility-label hidden px-6 py-4 text-ink-muted sm:table-cell"
                >
                  {label}
                </th>
                <td className="px-4 py-4 text-ink-muted sm:px-6">
                  <span className="utility-label mb-1 block text-ink-faint sm:hidden">{label}</span>
                  {board}
                </td>
                <td className="px-4 py-4 text-ink sm:px-6">
                  <span aria-hidden className="utility-label mb-1 block text-transparent sm:hidden">
                    {label}
                  </span>
                  {inroad}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </LandingSection>
  );
}
