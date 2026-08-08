import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <header className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pb-32 sm:pt-24">
      <h1 className="max-w-3xl font-mono text-3xl leading-tight text-ink sm:text-4xl">
        Get an inroad, not a rejection email.
      </h1>

      <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-text-secondary">
        Inroad finds companies that actually match what you&apos;re looking
        for, digs into the funding, team, and tech stack details that make a
        message worth reading, and helps you write outreach to someone who
        can actually hire you. No queue, no black box, just a real message to
        a real person who&apos;d have no idea you did an hour of research to
        write it.
      </p>

      <div className="mt-10">
        <Button href="/onboarding">Get started</Button>
      </div>
    </header>
  );
}
