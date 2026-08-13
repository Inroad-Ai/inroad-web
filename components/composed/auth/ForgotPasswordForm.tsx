"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { forgotPassword } from "@/lib/api-client/client";
import { isValidEmail } from "@/lib/onboarding";

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
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Check your email</h1>
        <p className="mt-3 font-sans text-sm text-text-secondary">
          If an account exists for <span className="text-text-primary">{email.trim()}</span>, we
          sent a link to reset the password.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">
          Reset your password
        </h1>
        <p className="mt-2 font-sans text-sm text-text-secondary">
          Enter the email on your account and we&apos;ll send a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <label htmlFor="email" className="utility-label text-text-secondary">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2"
        />

        {touched && !valid ? (
          <p className="mt-3 text-sm text-error">That doesn&apos;t look like a real email.</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}

        <Button type="submit" disabled={submitting} className="mt-8 w-full">
          {submitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="mt-8 border-t border-line pt-6 text-center font-sans text-sm text-text-secondary">
        <Link href="/login" className="text-signal-teal hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
