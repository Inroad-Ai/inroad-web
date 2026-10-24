"use client";

import { useState } from "react";

import {
  ApiError,
  deleteConnection,
  saveConnection,
  startOAuth,
  type Connection,
  type ConnectionProvider,
  type OAuthProvider,
} from "@/lib/api-client/client";
import { ensureValidAccessToken, SESSION_EXPIRED } from "@/lib/auth-native/browser";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Notice } from "@/components/ui/Notice";
import { KeyIcon, LockIcon } from "@/components/ui/Icons";
import { ApiKeyModal } from "./ApiKeyModal";

interface ConnectorCardProps {
  provider: ConnectionProvider;
  label: string;
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

/** One provider's card: logo, name, status, and either Connect (OAuth
 * redirect or API-key modal, per authMode) or Disconnect. */
export function ConnectorCard({
  provider,
  label,
  eyebrow,
  description,
  logoSrc,
  authMode,
  connection,
  onConnected,
  onDisconnected,
}: ConnectorCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function withToken(onToken: (token: string) => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        setError(SESSION_EXPIRED);
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
        setError(SESSION_EXPIRED);
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

  async function handleConnectApiKey(apiKey: string) {
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
    <Card as="article" className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-nest bg-chalk shadow-nest">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" className="h-full w-full object-contain p-2" />
        </span>
        <div className="min-w-0 flex-1">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h3 className="mt-1 font-display text-xl font-sans-semibold tracking-heading text-ink">
            {label}
          </h3>
        </div>
        {connection ? (
          <Badge tone="teal" dot>
            Connected
          </Badge>
        ) : (
          <Badge tone="neutral">Not connected</Badge>
        )}
      </div>

      <p className="text-sm leading-relaxed text-ink-muted">{description}</p>

      <p className="flex items-center gap-2 text-xs font-sans-semibold text-ink-faint">
        {authMode === "oauth" ? <LockIcon /> : <KeyIcon />}
        {authMode === "oauth" ? "Secure OAuth connection" : "API key authentication"}
      </p>

      <div className="mt-auto pt-1">
        {connection ? (
          <Button variant="quiet" size="sm" type="button" onClick={handleDisconnect} loading={busy}>
            {busy ? "Disconnecting..." : "Disconnect"}
          </Button>
        ) : (
          <Button
            size="sm"
            type="button"
            onClick={authMode === "oauth" ? handleConnectOAuth : openModal}
            loading={busy}
          >
            {busy ? "Connecting..." : "Connect"}
          </Button>
        )}
      </div>

      {error && !modalOpen ? (
        <Notice boxed size="xs">
          {error}
        </Notice>
      ) : null}

      {authMode === "api_key" && modalOpen ? (
        <ApiKeyModal
          label={label}
          busy={busy}
          error={error}
          onClose={() => setModalOpen(false)}
          onSubmit={handleConnectApiKey}
        />
      ) : null}
    </Card>
  );
}
