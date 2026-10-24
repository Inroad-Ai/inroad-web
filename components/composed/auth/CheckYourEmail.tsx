"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { resendVerification } from "@/lib/api-client/client";

import { AuthFooterNote, AuthLink } from "./AuthFooterNote";
import { AuthHeading } from "./AuthHeading";

/** Shown after signup instead of a session: the account isn't usable until
 * the link in the email is clicked. */
export function CheckYourEmail({ email }: { email: string }) {
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleResend() {
    setResending(true);
    try {
      await resendVerification(email);
    } finally {
      setResent(true);
      setResending(false);
    }
  }

  return (
    <div className="grid gap-7">
      <AuthHeading eyebrow="One more step" title="Check your email">
        We sent a confirmation link to <span className="font-sans-semibold text-ink">{email}</span>.
        Click it to finish setting up your account.
      </AuthHeading>

      <Button
        type="button"
        variant="quiet"
        size="lg"
        onClick={handleResend}
        disabled={resending || resent}
        className="w-full"
      >
        {resent ? "Sent again" : resending ? "Sending..." : "Resend the link"}
      </Button>

      <AuthFooterNote>
        Already confirmed? <AuthLink href="/login">Sign in</AuthLink>
      </AuthFooterNote>
    </div>
  );
}
