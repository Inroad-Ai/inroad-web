"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidEmail } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/browser";

export function ForgotPasswordForm() {
  const supabase = createClient();

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

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/confirm`,
    });

    // Show "sent" either way - whether or not that email has an account is
    // not something a stranger submitting this form gets to learn.
    if (resetError) setError(resetError.message);
    else setSent(true);
    setSubmitting(false);
  }

  if (sent) {
    return (
      <div>
        <h1 className="font-display text-2xl text-text-primary">Check your email</h1>
        <p className="mt-3 text-sm text-text-secondary">
          If an account exists for {email.trim()}, we sent a link to reset the password.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-text-primary">Reset your password</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Enter the email on your account and we&apos;ll send a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
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

      <p className="mt-6 text-sm text-text-secondary">
        <Link href="/login" className="text-signal-teal hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
