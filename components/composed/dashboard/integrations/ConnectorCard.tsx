"use client";

import { useState, type FormEvent } from "react";

import {
  ApiError,
  deleteConnection,
  saveConnection,
  startOAuth,
  type Connection,
  type ConnectionProvider,
  type OAuthProvider,
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
  category: string;
  eyebrow: string;
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
  category,
  eyebrow,
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
      // authMode is what says this provider has an OAuth flow, and the
      // route's own literal is narrower than ConnectionProvider.
      const authorizeUrl = await startOAuth(provider as OAuthProvider, token);
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
    <article
      className={`relative flex flex-col overflow-hidden rounded-lg border transition-all duration-200 ${
        connection
          ? "border-success/30 bg-success-subtle/30 shadow-sm hover:border-success/50 hover:shadow-card"
          : "border-line bg-surface shadow-sm hover:border-signal-teal/40 hover:shadow-card hover:bg-surface"
      }`}
    >
      {/* Connected indicator bar */}
      {connection && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-success to-signal-teal" />}

      <div className="flex flex-col p-6">
        {/* Header with logo and status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-raised">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="" className="h-full w-full object-contain p-1.5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-ink">{label}</h3>
              <p className="mt-1 text-sm text-text-secondary">{eyebrow}</p>
            </div>
          </div>

          {/* Status badge */}
          <div className="shrink-0">
            {connection ? (
              <Badge tone="success">
                <span className="h-2 w-2 rounded-full bg-success" />
                Connected
              </Badge>
            ) : (
              <Badge tone="neutral">Not connected</Badge>
            )}
          </div>
        </div>

        {/* Category and description */}
        <div className="mt-5 space-y-3 border-t border-line/40 pt-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-surface-raised px-2.5 py-1 text-xs font-medium text-text-secondary">
              {category}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
        </div>

        {/* Auth method info */}
        <div className="mt-5 flex items-center gap-2 pt-4 text-xs text-text-secondary">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-line/40">
            {authMode === "oauth" ? "🔐" : "🔑"}
          </span>
          <span>
            {authMode === "oauth"
              ? "Secure OAuth connection"
              : "API key authentication"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-2 pt-4">
          {connection ? (
            <>
              <Button
                variant="quiet"
                size="sm"
                type="button"
                onClick={handleDisconnect}
                disabled={busy}
                className="flex-1"
              >
                {busy ? "Disconnecting..." : "Disconnect"}
              </Button>
              <span className="flex flex-1 items-center justify-center rounded-full border border-success/40 bg-success-subtle px-5 py-2.5 font-display text-sm font-semibold text-success">
                ✓ Active
              </span>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={authMode === "oauth" ? handleConnectOAuth : openModal}
              disabled={busy}
              className="w-full"
            >
              {busy ? "Connecting..." : "Connect"}
            </Button>
          )}
        </div>

        {/* Error message */}
        {error && !modalOpen ? (
          <p className="mt-3 rounded-md border border-muted-rose/30 bg-muted-rose-subtle px-3 py-2 text-xs text-muted-rose">
            {error}
          </p>
        ) : null}
      </div>

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
    </article>
  );
}
