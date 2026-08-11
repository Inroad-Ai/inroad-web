import Link from "next/link";

import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 sm:items-center sm:py-28 sm:text-center">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">
          Get an inroad, not a rejection email.
        </h2>

        <Button href="/onboarding">Get started</Button>

        <Link href="/" className="font-display text-sm font-semibold text-text-secondary">
          Inroad
        </Link>
      </div>
    </footer>
  );
}
