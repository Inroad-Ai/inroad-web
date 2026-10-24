import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeControl } from "@/components/composed/ThemeControl";
import { Logo } from "@/components/ui/Logo";

import { AuthPanel } from "./AuthPanel";

/** Split screen for every auth route: the form column on the left, the node
 * field panel on the right (sticky, and dropped on narrow screens). */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative z-10 flex min-w-0 flex-col px-5 py-7 sm:px-10 xl:px-16">
        <header className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="Inroad home" className="rounded-nest">
            <Logo />
          </Link>
          <ThemeControl compact />
        </header>
        <main className="animate-fade-up w-full max-w-md py-10 lg:my-auto lg:py-12">
          {children}
        </main>
        <p className="mt-auto text-right text-xs font-sans-semibold text-ink-muted lg:mt-0">
          Nothing sends without you.
        </p>
      </div>
      <aside className="sticky top-0 hidden h-svh p-3 lg:block">
        <AuthPanel />
      </aside>
    </div>
  );
}
