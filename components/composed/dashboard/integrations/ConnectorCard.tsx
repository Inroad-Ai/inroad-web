"use client";

import { useState, type FormEvent } from "react";

import {
  ApiError,
  deleteConnection,
  saveConnection,
  startApolloOAuth,
  type Connection,
  type ConnectionProvider,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Section } from "@/components/ui/Section";

interface ConnectorCardProps {
  provider: ConnectionProvider;
  label: string;
  description: string;
  logoSrc: string;
  /** oauth: Connect redirects straight to the provider's own login, no key
   * ever touches Inroad. api_key: Connect opens a modal to paste one. */
  authMode: "oauth" | "api_key";
  connection: Connection | null;
  onConnected: (connection: Connection) => void;
  onDisconnected: (provider: string) => void;
}

/** One provider's card: logo, name, description, and either a Connect
 * button (OAuth redirect or API-key modal, per authMode) or a Connected
 * badge with Disconnect. The provider is fixed per card - see
 * IntegrationsBoard for the grid. */
export function ConnectorCard({
  provider,
  label,
  description,
  logoSrc,
  authMode,
  connection,
  onConnected,
  onDisconnected,
}: ConnectorCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function withToken(onToken: (token: string) => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setError("Your session expired. Sign in again.");
        return;
      }
      await onToken(token);
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === "connection_invalid") {
        setError(`${label} rejected that key. Double-check it and try again.`);
      } else {
        setError(caught instanceof Error ? caught.message : "Something went wrong.");
      }
    } finally {
      setBusy(false);
    }
  }

  function openModal() {
    setApiKey("");
    setError(null);
    setModalOpen(true);
  }

  async function handleConnectOAuth() {
    // No finally-reset of busy: on success the page navigates away.
    setBusy(true);
    setError(null);
    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setError("Your session expired. Sign in again.");
        setBusy(false);
        return;
      }
      const authorizeUrl = await startApolloOAuth(token);
      window.location.href = authorizeUrl;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start the connection.");
      setBusy(false);
    }
  }

  async function handleConnectApiKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await withToken(async (token) => {
      const saved = await saveConnection(provider, apiKey, token);
      onConnected(saved);
      setModalOpen(false);
    });
  }

  async function handleDisconnect() {
    await withToken(async (token) => {
      await deleteConnection(provider, token);
      onDisconnected(provider);
    });
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
          <Button
            variant="quiet"
            size="sm"
            type="button"
            onClick={authMode === "oauth" ? handleConnectOAuth : openModal}
            disabled={busy}
          >
            Connect
          </Button>
        )}
      </div>

      {error && !modalOpen ? <p className="mt-3 text-sm text-muted-rose">{error}</p> : null}

      {authMode === "api_key" ? (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Connect ${label}`}>
          <form onSubmit={handleConnectApiKey}>
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
      ) : null}
    </div>
  );
}
