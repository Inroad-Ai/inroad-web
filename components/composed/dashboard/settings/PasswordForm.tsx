"use client";

import { useEffect, useState } from "react";

import { changePassword, fetchMe } from "@/lib/api-client/client";
import { requireAccessToken, storeTokens } from "@/lib/auth-native/browser";
import { newPasswordProblem } from "@/lib/password";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { PasswordInput } from "@/components/ui/PasswordInput";

/** Sets a first password for an account that only signed in with Google,
 * or changes an existing one after the current one is entered. */
export function PasswordForm() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    requireAccessToken()
      .then((token) => fetchMe(token, controller.signal))
      .then((me) => setHasPassword(me.has_password ?? false))
      .catch(() => {
        if (!controller.signal.aborted) setHasPassword(false);
      });
    return () => controller.abort();
  }, []);

  const problem = newPasswordProblem(next, confirmation);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    setSaved(false);
    if (problem || (hasPassword && !current)) return;
    setSaving(true);
    setError("");
    try {
      storeTokens(
        await changePassword(hasPassword ? current : null, next, await requireAccessToken()),
      );
      setHasPassword(true);
      setCurrent("");
      setNext("");
      setConfirmation("");
      setTouched(false);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your password.");
    } finally {
      setSaving(false);
    }
  }

  if (hasPassword === null) return null;

  return (
    <form onSubmit={save} className="grid max-w-md gap-4">
      {!hasPassword ? (
        <p className="text-sm text-ink-muted">
          You sign in with Google. Set a password to also sign in with your email.
        </p>
      ) : null}
      {hasPassword ? (
        <Field label="Current password" htmlFor="current-password">
          <PasswordInput
            id="current-password"
            autoComplete="current-password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
          />
        </Field>
      ) : null}
      <Field label="New password" htmlFor="new-password">
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          value={next}
          onChange={(event) => setNext(event.target.value)}
        />
      </Field>
      <Field label="Confirm new password" htmlFor="confirm-new-password">
        <PasswordInput
          id="confirm-new-password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
        />
      </Field>

      {touched && hasPassword && !current ? <Notice>Enter your current password.</Notice> : null}
      {touched && problem ? <Notice>{problem}</Notice> : null}
      {error ? <Notice>{error}</Notice> : null}
      {saved ? (
        <p className="text-sm text-success" role="status">
          Password saved. Other devices are signed out.
        </p>
      ) : null}

      <div>
        <Button type="submit" size="sm" loading={saving}>
          {hasPassword ? "Change password" : "Set password"}
        </Button>
      </div>
    </form>
  );
}
