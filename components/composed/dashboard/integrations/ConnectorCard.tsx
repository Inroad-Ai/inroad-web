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
  type OAuthReturnTo,
} from "@/lib/api-client/client";
import { ensureValidAccessToken, SESSION_EXPIRED } from "@/lib/auth-native/browser";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Notice } from "@/components/ui/Notice";
import { KeyIcon, LockIcon } from "@/components/ui/Icons";
import { MONOGRAM_FACE, monogramFill } from "@/components/ui/monogram";
import { ApiKeyModal } from "./ApiKeyModal";

interface ConnectorCardProps {
  provider: ConnectionProvider;
  label: string;
  eyebrow: string;
  description: string;
  logoSrc: string | null;
  /** oauth: Connect redirects straight to the provider's own login, no key
   * ever touches Inroad. api_key: Connect opens a modal to paste one. */
  authMode: "oauth" | "api_key";
  /** A line for the key modal explaining what the key powers. Null for
   * providers whose card already covers it (Gmail, Apollo, Hunter). */
  keyNote: string | null;
  connection: Connection | null;
  onConnected: (connection: Connection) => void;
  onDisconnected: (provider: string) => void;
  /** The page an OAuth connect lands back on. */
  oauthReturnTo?: OAuthReturnTo;
  /** Onboarding: a boxed card inside another card. Otherwise a list row. */
  nested?: boolean;
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
  keyNote,
  connection,
  onConnected,
  onDisconnected,
  oauthReturnTo = "integrations",
  nested = false,
}: ConnectorCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  async function withToken(onToken: (token: string) => Promise<void>) {
    setBusy(true);
    setError(null);
    setSavedNote(null);
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
    setSavedNote(null);
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
      const authorizeUrl = await startOAuth(provider as OAuthProvider, token, oauthReturnTo);
      window.location.href = authorizeUrl;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start the connection.");
      setBusy(false);
    }
  }

  async function handleConnectApiKey(apiKey: string) {
    const updating = connection?.status === "invalid";
    await withToken(async (token) => {
      const saved = await saveConnection(provider, apiKey, token);
      onConnected(saved);
      setModalOpen(false);
      setSavedNote(updating ? `${label} key updated.` : `${label} key saved.`);
    });
  }

  async function handleDisconnect() {
    await withToken(async (token) => {
      await deleteConnection(provider, token);
      onDisconnected(provider);
      setSavedNote(authMode === "api_key" ? `${label} key removed.` : `${label} disconnected.`);
    });
  }

  const logo = (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-chalk shadow-nest ${
        nested ? "h-12 w-12 rounded-nest" : "h-10 w-10 rounded-lg"
      }`}
    >
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt="" className="h-full w-full object-contain p-2" />
      ) : (
        // No official logo bundled yet: fall back to the provider's
        // initial on its monogram colour, same as a person avatar.
        <span
          aria-hidden
          className={`${MONOGRAM_FACE} h-full w-full text-lg ${monogramFill(label)}`}
        >
          <span className="relative">{label.charAt(0).toUpperCase()}</span>
        </span>
      )}
    </span>
  );

  const status =
    connection?.status === "invalid" ? (
      <Badge tone="rose" dot>
        Key rejected
      </Badge>
    ) : connection ? (
      <Badge tone="teal" dot>
        Connected
      </Badge>
    ) : (
      <Badge tone="neutral">Not connected</Badge>
    );

  const actions =
    connection?.status === "invalid" ? (
      <>
        {/* Rejected key: offer a re-save (or reconnect) plus removal, so
         * the user can fix it without first deleting the dead key. */}
        <Button
          size="sm"
          type="button"
          onClick={authMode === "oauth" ? handleConnectOAuth : openModal}
          loading={busy}
        >
          {authMode === "oauth" ? "Reconnect" : "Update key"}
        </Button>
        <Button variant="quiet" size="sm" type="button" onClick={handleDisconnect}>
          Remove
        </Button>
      </>
    ) : connection ? (
      <Button variant="quiet" size="sm" type="button" onClick={handleDisconnect} loading={busy}>
        {busy ? "Disconnecting..." : "Disconnect"}
      </Button>
    ) : (
      <Button
        size="sm"
        variant={nested ? "primary" : "quiet"}
        type="button"
        onClick={authMode === "oauth" ? handleConnectOAuth : openModal}
        loading={busy}
      >
        {busy ? "Connecting..." : "Connect"}
      </Button>
    );

  const feedback =
    error && !modalOpen ? (
      <Notice boxed size="xs">
        {error}
      </Notice>
    ) : savedNote ? (
      <Notice tone="success" boxed size="xs">
        {savedNote}
      </Notice>
    ) : null;

  const modal =
    authMode === "api_key" && modalOpen ? (
      <ApiKeyModal
        label={label}
        note={keyNote}
        busy={busy}
        error={error}
        onClose={() => setModalOpen(false)}
        onSubmit={handleConnectApiKey}
      />
    ) : null;

  if (!nested) {
    return (
      <li className="py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {logo}
          <div className="min-w-0 flex-1 basis-56">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-sm font-sans-semibold text-ink">{label}</h3>
              {status}
            </div>
            <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{description}</p>
          </div>
          <div className="flex shrink-0 gap-2">{actions}</div>
        </div>
        {feedback ? <div className="mt-3">{feedback}</div> : null}
        {modal}
      </li>
    );
  }

  return (
    <Card as="article" variant="nested" className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        {logo}
        <div className="min-w-0 flex-1">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h3 className="mt-1 font-display text-xl font-sans-semibold tracking-heading text-ink">
            {label}
          </h3>
        </div>
        {status}
      </div>

      <p className="text-sm leading-relaxed text-ink-muted">{description}</p>

      <p className="flex items-center gap-2 text-xs font-sans-semibold text-ink-faint">
        {authMode === "oauth" ? <LockIcon /> : <KeyIcon />}
        {authMode === "oauth" ? "Secure OAuth connection" : "API key authentication"}
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-1">{actions}</div>
      {feedback}
      {modal}
    </Card>
  );
}
