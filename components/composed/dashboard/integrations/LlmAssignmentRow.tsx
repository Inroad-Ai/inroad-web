"use client";

import { useId, useState } from "react";

import {
  ApiError,
  clearLlmAssignment,
  setLlmAssignment,
  type Connection,
  type LlmAssignment,
  type LlmAssignmentProvider,
} from "@/lib/api-client/client";
import { ensureValidAccessToken, SESSION_EXPIRED } from "@/lib/auth-native/browser";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Notice } from "@/components/ui/Notice";
import { Select } from "@/components/ui/Select";
import { LLM_PROVIDER_LABELS, type LlmPurposeMeta } from "@/lib/llm-purposes";

const PROVIDER_IDS = Object.keys(LLM_PROVIDER_LABELS) as LlmAssignmentProvider[];
const DEFAULT = "default";

/** One purpose's picker: Platform default, or a connected provider plus the
 * model to use. Owns its own save, so one row saving never blocks another. */
export function LlmAssignmentRow({
  purpose,
  assignment,
  connections,
  onSaved,
  onCleared,
}: {
  purpose: LlmPurposeMeta;
  assignment: LlmAssignment | null;
  connections: Connection[];
  onSaved: (assignment: LlmAssignment) => void;
  onCleared: () => void;
}) {
  const selectId = useId();
  const modelId = useId();
  const [selected, setSelected] = useState<string>(assignment?.provider ?? DEFAULT);
  const [model, setModel] = useState(assignment?.model ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  function statusOf(provider: string): "connected" | "invalid" | null {
    return connections.find((entry) => entry.provider === provider)?.status ?? null;
  }

  // A removed key falls back to the default, but a rejected one keeps failing
  // (the backend never moves the user's calls onto Inroad's key unasked).
  const assignedStatus = assignment ? statusOf(assignment.provider) : null;
  const assignedLabel = assignment
    ? (LLM_PROVIDER_LABELS[assignment.provider as LlmAssignmentProvider] ?? assignment.provider)
    : null;
  const strandedNote =
    assignment && assignedStatus !== "connected"
      ? assignedStatus === "invalid"
        ? `Your ${assignedLabel} key was rejected, so ${purpose.label.toLowerCase()} will fail until you update the key above or switch to Platform default.`
        : `Your ${assignedLabel} key was removed. Using the platform default until you reconnect.`
      : null;

  const usingDefault = selected === DEFAULT;
  const providerConnected = !usingDefault && statusOf(selected) === "connected";
  const canSave = usingDefault ? assignment !== null : providerConnected && model.trim().length > 0;

  async function withToken(run: (token: string) => Promise<void>) {
    setBusy(true);
    setError(null);
    setSaved(null);
    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setError(SESSION_EXPIRED);
        return;
      }
      await run(token);
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === "provider_not_connected") {
        setError("Connect that provider's key above before assigning it.");
      } else {
        setError(caught instanceof Error ? caught.message : "Could not save.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    await withToken(async (token) => {
      if (usingDefault) {
        await clearLlmAssignment(purpose.id, token);
        onCleared();
        setSaved("Saved. This feature now uses the platform default.");
        return;
      }
      const saved = await setLlmAssignment(
        purpose.id,
        selected as LlmAssignmentProvider,
        model.trim(),
        token,
      );
      onSaved(saved);
      setSaved(
        `Saved. ${purpose.label} now uses your ${LLM_PROVIDER_LABELS[saved.provider as LlmAssignmentProvider] ?? saved.provider} key.`,
      );
    });
  }

  return (
    <div className="flex flex-col gap-3 border-t border-line pt-5 first:border-0 first:pt-0">
      <div className="min-w-0">
        <p className="text-sm font-sans-semibold text-ink">{purpose.label}</p>
        <p className="mt-1 text-xs text-ink-muted">{purpose.hint}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <Field label="Model provider" htmlFor={selectId}>
          <Select
            id={selectId}
            value={selected}
            onChange={(event) => {
              setSelected(event.target.value);
              setSaved(null);
            }}
            className="w-full sm:w-52"
          >
            <option value={DEFAULT}>Platform default</option>
            {PROVIDER_IDS.map((provider) => {
              const status = statusOf(provider);
              return (
                <option key={provider} value={provider} disabled={status !== "connected"}>
                  {LLM_PROVIDER_LABELS[provider]}
                  {status === "connected"
                    ? ""
                    : status === "invalid"
                      ? " (key rejected)"
                      : " (connect first)"}
                </option>
              );
            })}
          </Select>
        </Field>

        {usingDefault ? null : (
          <Field label="Model" htmlFor={modelId}>
            <Input
              id={modelId}
              value={model}
              onChange={(event) => {
                setModel(event.target.value);
                setSaved(null);
              }}
              placeholder="gpt-4o-mini"
              autoComplete="off"
              className="w-full sm:w-56"
            />
          </Field>
        )}

        <div className="flex gap-2">
          <Button size="sm" type="button" onClick={handleSave} loading={busy} disabled={!canSave}>
            Save
          </Button>
        </div>
      </div>

      {strandedNote ? (
        <Notice tone="neutral" boxed size="xs">
          {strandedNote}
        </Notice>
      ) : null}

      {error ? (
        <Notice size="xs" boxed>
          {error}
        </Notice>
      ) : saved ? (
        <Notice tone="success" size="xs" boxed>
          {saved}
        </Notice>
      ) : null}
    </div>
  );
}
