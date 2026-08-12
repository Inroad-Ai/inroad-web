"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { signOutNative } from "@/lib/auth-native/browser";
import { createClient } from "@/lib/supabase/browser";

const TITLES: Record<string, string> = {
  "/overview": "Overview",
  "/research": "Research",
  "/companies/pipeline": "Pipeline",
  "/companies": "Companies",
  "/settings": "Settings",
};

function pageTitle(pathname: string | null): string {
  if (!pathname) return "";
  // Longest prefix first, so "/companies/pipeline" wins over "/companies".
  const match = Object.keys(TITLES)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname.startsWith(prefix));
  return match ? TITLES[match] : "";
}

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    setSigningOut(true);
    // Clears whichever session actually got the user here: a native-auth
    // token pair (phase 2 backend, revokes the refresh token server-side),
    // a Supabase session (still how Google OAuth signs in), or - harmlessly
    // - both, since either call is a no-op when there's nothing to clear.
    const supabase = createClient();
    await Promise.all([signOutNative(), supabase.auth.signOut()]);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-surface px-6">
      <span className="font-display text-lg text-ink">{pageTitle(pathname)}</span>

      <div className="flex items-center gap-4">
        {email ? (
          <span className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal-teal-subtle font-display text-xs font-semibold text-signal-teal">
              {email.slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden font-sans text-sm text-text-secondary sm:inline">
              {email}
            </span>
          </span>
        ) : null}

        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="utility-label text-text-secondary transition-colors hover:text-muted-rose disabled:opacity-50"
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </header>
  );
}
