"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Notice } from "@/components/ui/Notice";
import { PasswordInput } from "@/components/ui/PasswordInput";

/** Mounted only while open, so every opening starts from an empty key. */
export function ApiKeyModal({
  label,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  label: string;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}) {
  const [apiKey, setApiKey] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(apiKey);
  }

  return (
    <Modal open onClose={onClose} title={`Connect ${label}`}>
      <form onSubmit={handleSubmit}>
        <Field label="API key" hint={`Found in your ${label} account settings.`}>
          <PasswordInput
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            required
            autoComplete="off"
            autoFocus
          />
        </Field>

        {error ? <Notice className="mt-3">{error}</Notice> : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="quiet" size="sm" type="button" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button size="sm" type="submit" loading={busy} disabled={!apiKey}>
            Connect
          </Button>
        </div>
      </form>
    </Modal>
  );
}
