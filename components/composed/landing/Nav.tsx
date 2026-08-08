import Link from "next/link";

import { Button } from "@/components/ui/Button";

export function Nav() {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="font-mono text-sm text-ink">
        Inroad
      </Link>

      <Button href="/onboarding" className="px-4 py-2 text-sm">
        Get started
      </Button>
    </nav>
  );
}
