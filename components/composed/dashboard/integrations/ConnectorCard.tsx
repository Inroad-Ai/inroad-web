"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";

import {
  ApiError,
  deleteConnection,
  saveConnection,
  type Connection,
  type ConnectionProvider,
  type OAuthProvider,
} from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { redirectToProvider } from "@/lib/connections";
import { formatRelativeDays, formatTimestamp } from "@/lib/format";
import { ConnectionNotice } from "@/components/composed/dashboard/integrations/ConnectionNotice";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ExternalLinkIcon, PlugIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { PasswordInput } from "@/components/ui/PasswordInput";

interface ConnectorCardProps {
  provider: ConnectionProvider;
  label: string;
  eyebrow: string;
  description: string;
  logoSrc: string;
  authMode: "oauth" | "api_key";
  authHint: string;
  disconnectConsequence: string;
  connection: Connection | null;
  onConnected: (connection: Connection) => void;
  onDisconnected: (provider: string) => void;
}

export function ConnectorCard({
  provider,
  label,
  eyebrow,
  description,
  logoSrc,
  authMode,
  authHint,
  disconnectConsequence,
  connection,
  onConnected,
  onDisconnected,
}: ConnectorCardProps) {
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
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
    setKeyModalOpen(true);
  }

  async function handleConnectOAuth() {
    setBusy(true);
    setError(null);
    try {
      await redirectToProvider(provider as OAuthProvider);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start the connection.");
      setBusy(false);
    }
  }

  async function saveApiKey() {
    await withToken(async (token) => {
      const saved = await saveConnection(provider, apiKey, token);
      onConnected(saved);
      setKeyModalOpen(false);
    });
  }

  function handleConnectApiKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void saveApiKey();
  }

  async function handleDisconnect() {
    await withToken(async (token) => {
      await deleteConnection(provider, token);
      onDisconnected(provider);
      setDisconnectOpen(false);
    });
  }

  const invalid = connection?.status === "invalid";

  return (
    <article
      className={`rounded-sm border bg-surface p-6 shadow-card ${
        invalid ? "border-warning/40" : "border-line"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line bg-surface-raised">
            <Image
              src={logoSrc}
              alt=""
              width={56}
              height={56}
              className="h-full w-full object-contain p-1.5"
            />
          </div>
          <div>
            <h3 className="font-semibold text-ink">{label}</h3>
            <p className="text-sm text-text-secondary">{eyebrow}</p>
          </div>
        </div>
        {invalid ? (
          <Badge tone="warning">Needs attention</Badge>
        ) : connection ? (
          <Badge tone="success">Connected</Badge>
        ) : (
          <Badge tone="neutral">Not connected</Badge>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary">{description}</p>

      {invalid ? (
        <p className="mt-3 text-sm text-warning" role="status">
          This connection is no longer working. Reconnect to use {label} again.
        </p>
      ) : null}
      <p className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
        {authMode === "oauth" ? <ExternalLinkIcon /> : <PlugIcon />}
        {authHint}
      </p>
      {connection ? (
        <p
          className="mt-2 text-xs text-text-secondary"
          title={
            connection.last_validated_at ? formatTimestamp(connection.last_validated_at) : undefined
          }
        >
          {connection.last_validated_at
            ? `Last checked ${formatRelativeDays(connection.last_validated_at)}`
            : "Not checked yet"}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
        {!connection || invalid ? (
          <Button
            type="button"
            size="sm"
            onClick={authMode === "oauth" ? handleConnectOAuth : openModal}
            disabled={busy}
          >
            {busy ? "Connecting..." : invalid ? "Reconnect" : "Connect"}
          </Button>
        ) : null}
        {connection ? (
          <Button
            type="button"
            variant="quiet"
            size="sm"
            onClick={() => {
              setError(null);
              setDisconnectOpen(true);
            }}
            disabled={busy}
          >
            Disconnect
          </Button>
        ) : null}
      </div>

      {error && !keyModalOpen && !disconnectOpen ? (
        <div className="mt-4">
          <ConnectionNotice
            tone="error"
            message={error}
            action="Try again"
            onAction={() => void handleConnectOAuth()}
            busy={busy}
          />
        </div>
      ) : null}

      {authMode === "api_key" ? (
        <Modal
          open={keyModalOpen}
          onClose={() => {
            if (!busy) setKeyModalOpen(false);
          }}
          title={`${invalid ? "Reconnect" : "Connect"} ${label}`}
        >
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

            {error ? (
              <div className="mt-3">
                <ConnectionNotice
                  tone="error"
                  message={error}
                  action="Try again"
                  onAction={() => void saveApiKey()}
                  busy={busy}
                />
              </div>
            ) : null}

            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="quiet"
                size="sm"
                type="button"
                onClick={() => setKeyModalOpen(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={busy || !apiKey}>
                {invalid ? "Reconnect" : "Connect"}
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}

      <Modal
        open={disconnectOpen}
        onClose={() => {
          if (!busy) setDisconnectOpen(false);
        }}
        title={`Disconnect ${label}?`}
      >
        <p className="text-sm text-text-secondary">{disconnectConsequence}</p>
        {error ? (
          <div className="mt-4">
            <ConnectionNotice
              tone="error"
              message={error}
              action="Try again"
              onAction={() => void handleDisconnect()}
              busy={busy}
            />
          </div>
        ) : null}
        <div className="mt-5 flex justify-end gap-3">
          <Button
            type="button"
            variant="quiet"
            size="sm"
            onClick={() => setDisconnectOpen(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={() => void handleDisconnect()} disabled={busy}>
            {busy ? "Disconnecting..." : "Disconnect"}
          </Button>
        </div>
      </Modal>
    </article>
  );
}
