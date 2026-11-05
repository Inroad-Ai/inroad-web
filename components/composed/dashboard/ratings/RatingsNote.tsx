import { TextLink } from "@/components/ui/TextLink";

/** Rating is consent to learning; every place that rates says so. */
export function RatingsNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-ink-faint ${className}`}>
      Your ratings teach Inroad what to show you.{" "}
      <TextLink href="/settings#learning">Manage in Settings</TextLink>
    </p>
  );
}
