import { Button } from "@/components/ui/Button";

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <h1 className="font-display text-3xl text-text-primary">Let&apos;s set you up</h1>
      <p className="mt-5 text-lg text-text-secondary">
        Inroad finds companies that actually match what you&apos;re looking for,
        digs into the funding, team, and tech stack details that make a
        message worth reading, and helps you write outreach to someone who
        can actually hire you. No queue, no black box, just a real message to
        a real person.
      </p>
      <p className="mt-4 text-sm text-text-secondary">
        Seven short steps. Answer one thing at a time, go back whenever you
        want to change something.
      </p>
      <Button type="button" autoFocus onClick={onStart} className="mt-8">
        Let&apos;s go
      </Button>
    </div>
  );
}
