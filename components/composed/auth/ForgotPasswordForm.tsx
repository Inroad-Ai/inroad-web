"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Notice } from "@/components/ui/Notice";
import { forgotPassword } from "@/lib/api-client/client";
import { isValidEmail } from "@/lib/onboarding";

import { AuthFooterNote, AuthLink } from "./AuthFooterNote";
import { AuthHeading } from "./AuthHeading";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const valid = isValidEmail(email);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!valid) return;

    setSubmitting(true);
    setError(null);

    // The backend answers the same way for a registered address and an
    // unknown one, so there is nothing to branch on here: only a transport
    // failure is worth showing.
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch {
      setError("Could not reach the auth service. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="grid gap-7">
        <AuthHeading eyebrow="Account help" title="Check your email">
          If an account exists for{" "}
          <span className="font-sans-semibold text-ink">{email.trim()}</span>, we sent a link to
          reset the password.
        </AuthHeading>
        <AuthFooterNote>
          <AuthLink href="/login">Back to sign in</AuthLink>
        </AuthFooterNote>
      </div>
    );
  }

  return (
    <div className="grid gap-7">
      <AuthHeading eyebrow="Account help" title="Reset your password">
        Enter the email on your account and we&apos;ll send a link to reset your password.
      </AuthHeading>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoFocus
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </Field>

        {touched && !valid ? <Notice>That doesn&apos;t look like a real email.</Notice> : null}
        {error ? <Notice>{error}</Notice> : null}

        <Button type="submit" size="lg" loading={submitting} className="mt-2 w-full">
          {submitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <AuthFooterNote>
        Remembered it? <AuthLink href="/login">Back to sign in</AuthLink>
      </AuthFooterNote>
    </div>
  );
}
