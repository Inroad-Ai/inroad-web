import { Button } from "@/components/ui/Button";
import { VALUE_PROPS } from "@/lib/onboarding";

export function WelcomeScreen({
  phases,
  onStart,
}: {
  // The same phase list the progress indicator shows once the flow starts -
  // reused here instead of a hand-typed step count, so this line can't go
  // stale the next time a step gets added, split, or removed.
  phases: readonly string[];
  onStart: () => void;
}) {
  return (
    <div>
      <h1 className="font-display text-3xl text-text-primary">Let&apos;s set you up</h1>
      <p className="mt-3 text-lg text-text-secondary">
        No queue, no black box - just a real message to a real person.
      </p>

      <div className="mt-8 space-y-5">
        {VALUE_PROPS.map((prop) => (
          <div key={prop.title}>
            <p className="font-display font-semibold text-text-primary">{prop.title}</p>
            <p className="mt-1 text-sm text-text-secondary">{prop.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-text-secondary">
        {phases.length} quick sections - {phases.join(", ")}. Answer one thing at a time, go back
        whenever you want to change something.
      </p>

      <Button type="button" autoFocus onClick={onStart} className="mt-8">
        Let&apos;s go
      </Button>
    </div>
  );
}
