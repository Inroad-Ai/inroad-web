"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resolvePostAuthPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/browser";

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  // /auth/confirm already exchanged the recovery link for a session before
  // redirecting here - this page's only job is collecting the new password.
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(Boolean(data.session)));
  }, [supabase]);

  const valid = password.length >= 8;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!valid) return;

    setSubmitting(true);
    setError(null);

    const { data, error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError || !data.user) {
      setError(updateError?.message ?? "Could not update your password.");
      setSubmitting(false);
      return;
    }

    const path = await resolvePostAuthPath(supabase, data.user.id);
    router.push(path);
    router.refresh();
  }

  if (hasSession === false) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Link expired</h1>
        <p className="mt-3 font-sans text-sm text-text-secondary">
          This reset link is no longer valid. Request a new one from the{" "}
          <Link href="/forgot-password" className="text-signal-teal hover:underline">
            forgot password
          </Link>{" "}
          page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Set a new password</h1>
        <p className="mt-2 font-sans text-sm text-text-secondary">
          Pick something at least 8 characters long. You&apos;ll be signed in straight after.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <label htmlFor="password" className="utility-label text-text-secondary">
          New password
        </label>
        <Input
          id="password"
          type="password"
          autoFocus
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2"
        />

        {touched && !valid ? (
          <p className="mt-3 text-sm text-error">Password needs to be at least 8 characters.</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}

        <Button type="submit" disabled={submitting || hasSession === null} className="mt-8 w-full">
          {submitting ? "Saving..." : "Save password"}
        </Button>
      </form>
    </div>
  );
}
