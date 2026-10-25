import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/components/composed/landing/Footer";
import { ThemeControl } from "@/components/composed/ThemeControl";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Logo } from "@/components/ui/Logo";
import { LEGAL } from "@/lib/legal";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

/** Shared shell for the Privacy Policy and Terms: a contents list, then
 * numbered sections whose ids match it. */
export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: ReactNode;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-6 sm:px-8">
        <Link href="/" aria-label="Inroad home" className="rounded-full">
          <Logo />
        </Link>
        <ThemeControl compact />
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-8 sm:pt-16">
        <Eyebrow dot="static">Legal</Eyebrow>
        <h1 className="mt-4 text-balance font-display text-title font-sans-semibold leading-display tracking-display text-ink">
          {title}
        </h1>
        <p className="mt-3 text-sm font-sans-semibold text-ink-muted">
          Last updated {LEGAL.lastUpdated}
        </p>
        <div className="mt-8 grid gap-4 text-base text-ink-muted">{intro}</div>

        <nav aria-label="On this page" className="mt-10 rounded-card border border-line p-5 sm:p-6">
          <h2 className="utility-label text-ink-muted">On this page</h2>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm font-sans-semibold text-ink-muted transition-colors duration-fast hover:text-ink"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="mt-12 scroll-mt-8">
            <h2 className="font-display text-2xl font-sans-semibold tracking-display text-ink">
              {index + 1}. {section.title}
            </h2>
            <div className="mt-4 grid gap-4 text-base text-ink-muted [&_li]:pl-1 [&_strong]:font-sans-semibold [&_strong]:text-ink [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5">
              {section.body}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
