"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ApiError, verifyEmail } from "@/lib/api-client/client";
import { resolvePostAuthPath } from "@/lib/auth";
import { storeTokens } from "@/lib/auth-native/browser";

import { AuthFooterNote, AuthLink } from "./AuthFooterNote";
import { AuthHeading } from "./AuthHeading";

/** Where the confirmation email points. Confirming also signs the user in,
 * so this lands them in the app rather than back at a login form. */
export function VerifyEmail() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [error, setError] = useState<string | null>(null);
  // The confirmation token is single-use, so spending it twice reports a
  // dead link over the top of a confirmation that actually worked. React's
  // development double-invoke would do exactly that without this guard.
  const handled = useRef(false);

  useEffect(() => {
    if (!token) {
      setError("This confirmation link is missing its token.");
      return;
    }
    if (handled.current) return;
    handled.current = true;

    // No cancel-on-unmount flag: the token has already been spent by the
    // time this resolves, so dropping the result would strand the user on a
    // spinner with no way to retry.
    verifyEmail(token)
      .then(async (tokens) => {
        storeTokens(tokens);
        router.replace(await resolvePostAuthPath(tokens.access_token));
        router.refresh();
      })
      .catch((verifyError) => {
        setError(
          verifyError instanceof ApiError
            ? verifyError.message
            : "Could not confirm your email. Try again.",
        );
      });
  }, [token, router]);

  if (error) {
    return (
      <div className="grid gap-7">
        <AuthHeading eyebrow="Email confirmation" title="Link didn't work">
          {error}
        </AuthHeading>
        <AuthFooterNote>
          <AuthLink href="/signup">Start again</AuthLink> or{" "}
          <AuthLink href="/login">sign in</AuthLink>.
        </AuthFooterNote>
      </div>
    );
  }

  return (
    <AuthHeading eyebrow="Email confirmation" isLive title="Confirming your email">
      This takes a second. You&apos;ll go straight in once it&apos;s done.
    </AuthHeading>
  );
}
