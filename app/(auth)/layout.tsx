import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/Logo";

/**
 * One centred column for every auth screen: logo, then the form on a raised
 * card, then a way back out. The two blurred washes are the only decoration —
 * enough to keep the page from reading as an empty form, not enough to compete
 * with the one thing there is to do here.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-signal-amber-subtle opacity-70 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-signal-teal-subtle opacity-60 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <Link href="/" aria-label="Inroad home" className="flex justify-center">
          <Logo />
        </Link>

        <div className="mt-8 rounded-lg border border-line bg-surface p-8 shadow-card">
          {children}
        </div>

        <p className="mt-6 text-center font-sans text-sm text-text-secondary">
          <Link href="/" className="transition-colors hover:text-ink">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
