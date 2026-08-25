"use client";

import { useState, type FormEvent } from "react";

import {
  ApiError,
  deleteConnection,
  saveConnection,
  type Connection,
  type ConnectionProvider,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Section } from "@/components/ui/Section";

interface ConnectorCardProps {
  provider: ConnectionProvider;
  label: string;
  description: string;
  connection: Connection | null;
  onConnected: (connection: Connection) => void;
  onDisconnected: (provider: string) => void;
}

/** One provider's connect/disconnect form. The provider is fixed per card -
 * each known provider renders its own instance, see IntegrationsBoard. */
export function ConnectorCard({
  provider,
  label,
  description,
  connection,
  onConnected,
  onDisconnected,
}: ConnectorCardProps) {
  const [apiKey, setApiKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setError("Your session expired. Sign in again.");
        return;
      }
      const saved = await saveConnection(provider, apiKey, token);
      setApiKey("");
      onConnected(saved);
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === "connection_invalid") {
        setError(`${label} rejected that key. Double-check it and try again.`);
      } else {
        setError(caught instanceof Error ? caught.message : "Could not save that key.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDisconnect() {
    setBusy(true);
    setError(null);
    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setError("Your session expired. Sign in again.");
        return;
      }
      await deleteConnection(provider, token);
      onDisconnected(provider);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not disconnect.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section
      title={label}
      meta={
        connection ? (
          <Badge tone="success">Connected</Badge>
        ) : (
          <Badge tone="neutral">Not connected</Badge>
        )
      }
    >
      <p className="text-sm text-text-secondary">{description}</p>

      {connection ? (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            {connection.last_validated_at
              ? `Verified ${new Date(connection.last_validated_at).toLocaleDateString()}`
              : null}
          </p>
          <Button variant="quiet" size="sm" type="button" onClick={handleDisconnect} disabled={busy}>
            Disconnect
          </Button>
        </div>
      ) : (
        <form className="mt-4 flex items-end gap-3" onSubmit={handleConnect}>
          <div className="flex-1">
            <Field label="API key">
              <PasswordInput
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                required
                autoComplete="off"
              />
            </Field>
          </div>
          <Button type="submit" size="sm" disabled={busy || !apiKey}>
            Connect
          </Button>
        </form>
      )}

      {error ? <p className="mt-3 text-sm text-muted-rose">{error}</p> : null}
    </Section>
  );
}
