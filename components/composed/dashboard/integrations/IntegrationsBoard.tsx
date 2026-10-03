"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ConnectorCard } from "@/components/composed/dashboard/integrations/ConnectorCard";
import { ConnectionNotice } from "@/components/composed/dashboard/integrations/ConnectionNotice";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useConnections } from "@/hooks/useConnections";
import type { Connection, OAuthProvider } from "@/lib/api-client/client";
import { redirectToProvider } from "@/lib/connections";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Outreach: "Send approved outreach from your own inbox.",
  "Contact data": "Find contact details for people at researched companies.",
};

const KNOWN_PROVIDERS = [
  {
    provider: "gmail",
    label: "Gmail",
    category: "Outreach",
    eyebrow: "Send from your inbox",
    description:
      "Puts a drafted outreach email into your own Gmail Drafts, or sends it from your " +
      "account after you confirm the recipient. Every send is one you asked for; nothing " +
      "goes out on its own, and Inroad cannot read your existing mail.",
    logoSrc: "/logos/gmail.svg",
    authMode: "oauth",
    authHint: "You'll be redirected to Google to connect your inbox.",
    disconnectConsequence:
      "Saving drafts to Gmail and sending from your inbox will stop until you reconnect.",
  },
  {
    provider: "apollo",
    label: "Apollo.io",
    category: "Contact data",
    eyebrow: "Find verified emails",
    description:
      "Fills in missing emails for people found via LinkedIn search. Requires an Apollo " +
      "plan with API access to People Enrichment - Apollo gates raw API calls above its " +
      "lower tiers, separate from its no-code Zapier/CRM integrations.",
    logoSrc: "/logos/apollo.svg",
    authMode: "oauth",
    authHint: "You'll be redirected to Apollo to connect your account.",
    disconnectConsequence: "Apollo contact enrichment will stop until you reconnect.",
  },
  {
    provider: "hunter",
    label: "Hunter.io",
    category: "Contact data",
    eyebrow: "Find verified emails",
    description:
      "Fills in missing emails for people found via LinkedIn search. Free plan includes " +
      "50 lookups/month with no card required - a good fallback when Apollo doesn't have a match.",
    logoSrc: "/logos/hunter.png",
    authMode: "api_key",
    authHint: "You'll paste your Hunter API key in a secure form.",
    disconnectConsequence: "Hunter contact enrichment will stop until you reconnect.",
  },
] as const;

function IntegrationsSkeleton() {
  return (
    <div className="mt-8 max-w-3xl space-y-6" role="status" aria-label="Loading integrations">
      <Skeleton className="h-16 rounded-sm" />
      {KNOWN_PROVIDERS.map((entry) => (
        <Skeleton key={entry.provider} className="h-52 rounded-sm" />
      ))}
    </div>
  );
}

type RedirectNotice = {
  tone: "error" | "success";
  message: string;
  provider: OAuthProvider | null;
};

function useOAuthRedirectNotice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState<RedirectNotice | null>(null);

  useEffect(() => {
    const error = searchParams.get("connect_error");
    const connected = searchParams.get("connected");
    if (!error && !connected) return;

    const providerName = error ? searchParams.get("provider") : connected;
    const entry = KNOWN_PROVIDERS.find((candidate) => candidate.provider === providerName);
    const label = entry?.label ?? "That provider";
    setNotice({
      tone: error ? "error" : "success",
      message: error ? `Could not connect ${label}.` : `${label} connected.`,
      provider: entry?.authMode === "oauth" ? entry.provider : null,
    });
    router.replace("/integrations");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { notice, setNotice };
}

export function IntegrationsBoard() {
  const { connections, setConnections, loading, error } = useConnections();
  const { notice, setNotice } = useOAuthRedirectNotice();
  const [retrying, setRetrying] = useState(false);

  if (loading) return <IntegrationsSkeleton />;
  if (error) {
    return (
      <div className="mt-8 max-w-3xl rounded-sm border border-line bg-surface px-6 py-10 text-center shadow-card">
        <EmptyState>{error}</EmptyState>
        <Button
          type="button"
          variant="quiet"
          size="sm"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    );
  }

  function handleConnected(connection: Connection) {
    setConnections((current) => [
      ...current.filter((existing) => existing.provider !== connection.provider),
      connection,
    ]);
  }

  function handleDisconnected(provider: string) {
    setConnections((current) => current.filter((existing) => existing.provider !== provider));
  }

  async function retryOAuth(provider: OAuthProvider) {
    setRetrying(true);
    try {
      await redirectToProvider(provider);
    } catch (caught) {
      setNotice({
        tone: "error",
        provider,
        message: caught instanceof Error ? caught.message : "Could not start the connection.",
      });
      setRetrying(false);
    }
  }

  const connectedCount = connections.filter(
    (connection) =>
      connection.status === "connected" &&
      KNOWN_PROVIDERS.some((entry) => entry.provider === connection.provider),
  ).length;
  const invalidCount = connections.filter(
    (connection) =>
      connection.status === "invalid" &&
      KNOWN_PROVIDERS.some((entry) => entry.provider === connection.provider),
  ).length;

  const groupedProviders = KNOWN_PROVIDERS.reduce(
    (acc, provider) => {
      const cat = provider.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat]!.push(provider);
      return acc;
    },
    {} as Record<string, (typeof KNOWN_PROVIDERS)[number][]>,
  );
  const retryProvider = notice?.provider;

  return (
    <div className="mt-8 max-w-3xl space-y-8">
      {notice ? (
        <ConnectionNotice
          tone={notice.tone}
          message={notice.message}
          action={notice.tone === "error" && retryProvider ? "Try again" : undefined}
          onAction={retryProvider ? () => void retryOAuth(retryProvider) : undefined}
          busy={retrying}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-line bg-surface px-6 py-4 shadow-card">
        <p className="text-sm font-medium text-ink">Connection status</p>
        <Badge tone="success">{connectedCount} connected</Badge>
        {invalidCount > 0 ? <Badge tone="warning">{invalidCount} need attention</Badge> : null}
      </div>

      {Object.entries(groupedProviders).map(([category, providers]) => (
        <section key={category}>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-ink">{category}</h2>
            <p className="mt-1 text-sm text-text-secondary">{CATEGORY_DESCRIPTIONS[category]}</p>
          </div>

          <div className="space-y-4">
            {providers.map((entry) => (
              <ConnectorCard
                key={entry.provider}
                provider={entry.provider}
                label={entry.label}
                eyebrow={entry.eyebrow}
                description={entry.description}
                logoSrc={entry.logoSrc}
                authMode={entry.authMode}
                authHint={entry.authHint}
                disconnectConsequence={entry.disconnectConsequence}
                connection={
                  connections.find((connection) => connection.provider === entry.provider) ?? null
                }
                onConnected={handleConnected}
                onDisconnected={handleDisconnected}
              />
            ))}
          </div>
        </section>
      ))}

      <p className="text-sm text-text-secondary">
        Connections are private to your account and used only when you start research or outreach.
      </p>
    </div>
  );
}
