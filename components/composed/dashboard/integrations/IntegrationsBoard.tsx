"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ConnectorCard } from "@/components/composed/dashboard/integrations/ConnectorCard";
import { PlugIcon } from "@/components/ui/Icons";
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
    category: "Outreach",
    eyebrow: "Send from your inbox",
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
    category: "Contact data",
    eyebrow: "Find verified emails",
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
    category: "Contact data",
    eyebrow: "Find verified emails",
    description:
      "Fills in missing emails for people found via LinkedIn search. Free plan includes " +
      "50 lookups/month with no card required - a good fallback when Apollo doesn't have a match.",
    logoSrc: "/logos/hunter.png",
    authMode: "api_key",
  },
] as const;

function IntegrationsSkeleton() {
  return (
    <div className="mt-8 space-y-8">
      <Skeleton className="h-32 rounded-lg" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {KNOWN_PROVIDERS.map((entry) => (
          <Skeleton key={entry.provider} className="h-64 rounded-md" />
        ))}
      </div>
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

  const connectedCount = connections.filter((connection) =>
    KNOWN_PROVIDERS.some((provider) => provider.provider === connection.provider),
  ).length;

  return (
    <div className="mt-8 space-y-8">
      {redirectNotice ? (
        <p className="rounded-md border border-success/40 bg-success-subtle px-4 py-3 text-sm text-success">
          {redirectNotice}
        </p>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
        <div className="grid gap-6 px-6 py-6 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-signal-amber-subtle text-ink">
              <PlugIcon />
            </div>
            <div>
              <p className="utility-label text-signal-teal">Your connected tools</p>
              <h2 className="mt-2 text-xl text-ink">Build a more complete outreach workflow</h2>
              <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                Connect the services you already use. Inroad only uses each connection for
                the work you start.
              </p>
            </div>
          </div>
          <div className="rounded-md border border-line bg-surface-raised px-5 py-4 md:min-w-36">
            <p className="utility-label text-text-secondary">Connected</p>
            <p className="mt-1 text-2xl text-ink">
              {connectedCount}
              <span className="text-base text-text-secondary"> / {KNOWN_PROVIDERS.length}</span>
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="utility-label text-signal-teal">Available connections</p>
          <h2 className="mt-2 text-xl text-ink">Choose the tools that fit your search</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {KNOWN_PROVIDERS.map((entry) => (
            <ConnectorCard
              key={entry.provider}
              provider={entry.provider}
              label={entry.label}
              category={entry.category}
              eyebrow={entry.eyebrow}
              description={entry.description}
              logoSrc={entry.logoSrc}
              authMode={entry.authMode}
              connection={connections.find((connection) => connection.provider === entry.provider) ?? null}
              onConnected={handleConnected}
              onDisconnected={handleDisconnected}
            />
          ))}
        </div>
        <p className="mt-5 text-sm text-text-secondary">
          Connections are optional. You can add or remove them whenever your workflow changes.
        </p>
      </section>
    </div>
  );
}
