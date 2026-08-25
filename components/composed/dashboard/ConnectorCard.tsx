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
import { Modal } from "@/components/ui/Modal";
import { PasswordInput } from "@/components/ui/PasswordInput";

interface ConnectorCardProps {
  provider: ConnectionProvider;
  label: string;
  description: string;
  logoSrc: string;
  connection: Connection | null;
  onConnected: (connection: Connection) => void;
  onDisconnected: (provider: string) => void;
}

/** One provider's card: logo, name, description, and either a Connect
 * button (opens the API-key modal) or a Connected badge with Disconnect.
 * The provider is fixed per card - see IntegrationsBoard for the grid. */
export function ConnectorCard({
  provider,
  label,
  description,
  logoSrc,
  connection,
  onConnected,
  onDisconnected,
}: ConnectorCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openModal() {
    setApiKey("");
    setError(null);
    setModalOpen(true);
  }

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
      onConnected(saved);
      setModalOpen(false);
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
    <div className="flex flex-col rounded-md border border-line bg-surface p-6 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-surface-raised">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" className="h-full w-full object-contain p-1.5" />
        </div>
        <h3 className="text-base text-ink">{label}</h3>
      </div>

      <p className="mt-4 flex-1 text-sm text-text-secondary">{description}</p>

      <div className="mt-5">
        {connection ? (
          <div className="flex items-center justify-between gap-3">
            <Badge tone="success">Connected</Badge>
            <Button variant="quiet" size="sm" type="button" onClick={handleDisconnect} disabled={busy}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button variant="quiet" size="sm" type="button" onClick={openModal}>
            Connect
          </Button>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Connect ${label}`}>
        <form onSubmit={handleConnect}>
          <Field label="API key" hint={`Found in your ${label} account settings.`}>
            <PasswordInput
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              required
              autoComplete="off"
              autoFocus
            />
          </Field>

          {error ? <p className="mt-3 text-sm text-muted-rose">{error}</p> : null}

          <div className="mt-5 flex justify-end gap-3">
            <Button
              variant="quiet"
              size="sm"
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={busy || !apiKey}>
              Connect
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
