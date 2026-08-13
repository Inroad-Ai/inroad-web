"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";

export function Nav() {
  const [signedIn, setSignedIn] = useState(false);

  // A native token is what middleware.ts actually admits to /research, so
  // that's the same thing this link should be asking about.
  useEffect(() => {
    let cancelled = false;

    ensureValidAccessToken()
      .then((token) => {
        if (!cancelled) setSignedIn(token !== null);
      })
      .catch(() => {
        // Nav falls back to "Get started"; the route guards own session state.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" aria-label="Inroad home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          <a
            href="#sources"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-ink"
          >
            What you get
          </a>
          <a
            href="#how-it-works"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-ink"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-ink"
          >
            FAQ
          </a>
        </div>

        {signedIn ? (
          <Button href="/research" className="px-4 py-2 text-sm">
            Dashboard
          </Button>
        ) : (
          <Button href="/signup" className="px-4 py-2 text-sm">
            Get started
          </Button>
        )}
      </div>
    </nav>
  );
}
