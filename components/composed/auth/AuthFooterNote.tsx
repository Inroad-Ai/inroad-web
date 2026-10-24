import Link from "next/link";
import type { ReactNode } from "react";

/** The quiet line under a form that points somewhere else ("New here? Create an account"). */
export function AuthFooterNote({ children }: { children: ReactNode }) {
  return <p className="text-sm font-sans-semibold text-ink-muted">{children}</p>;
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-sans-bold text-ink underline decoration-ink/30 underline-offset-4 transition-colors duration-fast hover:decoration-ink"
    >
      {children}
    </Link>
  );
}
