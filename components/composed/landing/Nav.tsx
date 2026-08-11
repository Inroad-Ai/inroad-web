"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/browser";

export function Nav() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-signal-amber">
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5 text-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path d="M4 12 12 4M12 4H6M12 4v6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-display text-sm font-semibold text-ink">Inroad</span>
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
