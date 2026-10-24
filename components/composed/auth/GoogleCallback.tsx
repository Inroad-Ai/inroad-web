"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { resolvePostAuthPath } from "@/lib/auth";
import { storeTokens } from "@/lib/auth-native/browser";

import { AuthFooterNote, AuthLink } from "./AuthFooterNote";
import { AuthHeading } from "./AuthHeading";

/** Where the backend sends the browser after Google sign-in. The session
 * arrives in the URL fragment rather than the query string, because a
 * fragment is never sent to a server: it stays out of access logs and
 * Referer headers. That also means only client-side code can read it, which
 * is why this is a page and not a route handler. */
export function GoogleCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  // Reading the fragment consumes it: the tokens are cleared from the URL
  // below. Under React's development double-invoke that would leave the
  // second run looking at an empty fragment and reporting a failed sign-in
  // over the top of a successful one, so the whole effect runs once.
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setError(
        params.get("error") === "cancelled"
          ? "Google sign-in was cancelled."
          : "Google sign-in didn't complete. Try again.",
      );
      return;
    }

    storeTokens({ access_token: accessToken, refresh_token: refreshToken, token_type: "bearer" });
    // Drop the tokens out of the address bar before anything else renders,
    // so they aren't sitting in history or on screen.
    window.history.replaceState(null, "", window.location.pathname);

    resolvePostAuthPath(accessToken)
      .then((path) => {
        router.replace(path);
        router.refresh();
      })
      .catch(() => setError("Signed in, but couldn't load your account. Try again."));
  }, [router]);

  if (error) {
    return (
      <div className="grid gap-7">
        <AuthHeading eyebrow="Google sign-in" title="Couldn't sign you in">
          {error}
        </AuthHeading>
        <AuthFooterNote>
          <AuthLink href="/login">Back to sign in</AuthLink>
        </AuthFooterNote>
      </div>
    );
  }

  return (
    <AuthHeading eyebrow="Google sign-in" isLive title="Signing you in">
      Finishing up with Google. This takes a second.
    </AuthHeading>
  );
}
