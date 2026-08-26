"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ConnectorCard } from "@/components/composed/dashboard/integrations/ConnectorCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useConnections } from "@/hooks/useConnections";
import type { Connection } from "@/lib/api-client/client";

// Lusha and ContactOut append here later - authMode "api_key" for either,
// unless they turn out to offer OAuth too. No backend change required, see
// schemas/connection.py's ConnectionProvider literal on the API side.
const KNOWN_PROVIDERS = [
  {
    provider: "gmail",
    label: "Gmail",
    description:
      "Puts a drafted outreach email into your own Gmail Drafts, or sends it from your " +
      "account after you confirm the recipient. Every send is one you asked for; nothing " +
      "goes out on its own, and Inroad cannot read your existing mail.",
    logoSrc: "/logos/gmail.svg",
    authMode: "oauth",
  },
  {
    provider: "apollo",
    label: "Apollo.io",
    description:
      "Fills in missing emails for people found via LinkedIn search. Requires an Apollo " +
      "plan with API access to People Enrichment - Apollo gates raw API calls above its " +
      "lower tiers, separate from its no-code Zapier/CRM integrations.",
    logoSrc: "/logos/apollo.svg",
    authMode: "oauth",
  },
  {
    provider: "hunter",
    label: "Hunter.io",
    description:
      "Fills in missing emails for people found via LinkedIn search. Free plan includes " +
      "50 lookups/month with no card required - a good fallback when Apollo doesn't have a match.",
    logoSrc: "/logos/hunter.png",
    authMode: "api_key",
  },
] as const;

function IntegrationsSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {KNOWN_PROVIDERS.map((entry) => (
        <Skeleton key={entry.provider} className="h-44 rounded-md" />
      ))}
    </div>
  );
}

function labelFor(provider: string | null): string {
  return KNOWN_PROVIDERS.find((entry) => entry.provider === provider)?.label ?? "That provider";
}

/** Reads connected / connect_error off the URL after the OAuth redirect
 * lands back here, shows a one-line banner, then strips the query string so
 * a refresh doesn't repeat it. */
function useOAuthRedirectNotice(): string | null {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("connect_error");
    const connected = searchParams.get("connected");
    if (!error && !connected) return;

    const label = labelFor(error ? searchParams.get("provider") : connected);
    setNotice(error ? `Could not connect ${label}. Try again.` : `${label} connected.`);
    router.replace("/integrations");
    // Only ever runs once per landing: router.replace above changes the URL,
    // which would otherwise re-trigger this on the params it just cleared.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return notice;
}

export function IntegrationsBoard() {
  const { connections, setConnections, loading, error } = useConnections();
  const redirectNotice = useOAuthRedirectNotice();

  if (loading) return <IntegrationsSkeleton />;
  if (error) return <EmptyState className="py-16 text-center">{error}</EmptyState>;

  function handleConnected(connection: Connection) {
    setConnections([
      ...connections.filter((existing) => existing.provider !== connection.provider),
      connection,
    ]);
  }

  function handleDisconnected(provider: string) {
    setConnections(connections.filter((existing) => existing.provider !== provider));
  }

  return (
    <div className="mt-8">
      {redirectNotice ? <p className="mb-6 text-sm text-text-secondary">{redirectNotice}</p> : null}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {KNOWN_PROVIDERS.map((entry) => (
          <ConnectorCard
            key={entry.provider}
            provider={entry.provider}
            label={entry.label}
            description={entry.description}
            logoSrc={entry.logoSrc}
            authMode={entry.authMode}
            connection={connections.find((c) => c.provider === entry.provider) ?? null}
            onConnected={handleConnected}
            onDisconnected={handleDisconnected}
          />
        ))}
      </div>
    </div>
  );
}
