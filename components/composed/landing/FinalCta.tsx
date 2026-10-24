import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

import { RevealHeadline } from "./RevealHeadline";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-44 pt-36 text-center md:pb-48 md:pt-44">
      <div
        aria-hidden
        className="absolute -bottom-48 left-1/2 -z-10 h-96 w-full max-w-6xl -translate-x-1/2 scale-y-150 bg-glow-amber"
      />
      <Reveal className="mb-6">
        <Eyebrow>Your turn</Eyebrow>
      </Reveal>
      <RevealHeadline
        lines={[{ text: "Do the homework once. Make it count." }]}
        className="mx-auto max-w-4xl text-hero text-ink"
      />
      <Reveal as="p" delay={0.1} className="mx-auto mt-6 max-w-lg text-lg text-ink-muted">
        Set up your profile in four minutes. Your first twelve companies are researched before you
        finish your coffee.
      </Reveal>
      <Reveal delay={0.2} className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Button href="/signup" size="lg">
          Get started free
        </Button>
        <Button href="/login" variant="quiet" size="lg">
          I have an account
        </Button>
      </Reveal>
    </section>
  );
}
