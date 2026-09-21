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
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Outreach: "Send outreach from your own accounts with full transparency and control.",
  "Contact data": "Enrich people found during research with verified email addresses.",
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
    <div className="mt-8 space-y-10">
      {/* Header skeleton */}
      <div className="rounded-lg border border-line bg-surface p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-32 w-56 rounded-lg" />
        </div>
      </div>

      {/* Category sections */}
      {[1, 2].map((section) => (
        <div key={section} className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-72" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[1, 2].map((card) => (
              <Skeleton key={card} className="h-72 rounded-lg" />
            ))}
          </div>
        </div>
      ))}

      {/* Footer skeleton */}
      <Skeleton className="h-16 rounded-lg" />
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

  // Group providers by category
  const groupedProviders = KNOWN_PROVIDERS.reduce(
    (acc, provider) => {
      const cat = provider.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat]!.push(provider);
      return acc;
    },
    {} as Record<string, (typeof KNOWN_PROVIDERS)[number][]>,
  );

  return (
    <div className="mt-8 space-y-10">
      {redirectNotice ? (
        <p className="rounded-md border border-success/40 bg-success-subtle px-4 py-3 text-sm text-success">
          {redirectNotice}
        </p>
      ) : null}

      {/* Header Section */}
      <div className="rounded-lg border border-line bg-gradient-to-br from-surface to-surface-raised p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-signal-amber/10 text-signal-amber">
                <PlugIcon />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Connected services
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-ink">Your integration hub</h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm text-text-secondary">
              Connect the tools you already use to build a richer, more automated outreach workflow.
              Each connection is optional and only used for the work you explicitly start.
            </p>
          </div>

          {/* Progress Card */}
          <div className="flex flex-col rounded-lg border border-line/50 bg-surface p-6 lg:min-w-56">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Connected
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-4xl font-bold text-ink">{connectedCount}</p>
              <p className="text-sm text-text-secondary">of {KNOWN_PROVIDERS.length}</p>
            </div>
            <div className="mt-4 space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-line/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-signal-teal to-signal-amber transition-[width] duration-500"
                  style={{ width: `${(connectedCount / KNOWN_PROVIDERS.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary">
                {Math.round((connectedCount / KNOWN_PROVIDERS.length) * 100)}% complete
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      {Object.entries(groupedProviders).map(([category, providers]) => (
        <section key={category}>
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink">{category}</h2>
            <p className="mt-2 text-sm text-text-secondary">
              {CATEGORY_DESCRIPTIONS[category] ?? ""}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {providers.map((entry) => (
              <ConnectorCard
                key={entry.provider}
                provider={entry.provider}
                label={entry.label}
                category={entry.category}
                eyebrow={entry.eyebrow}
                description={entry.description}
                logoSrc={entry.logoSrc}
                authMode={entry.authMode}
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

      {/* Footer Note */}
      <div className="rounded-lg border border-line/50 bg-surface-raised px-6 py-5">
        <p className="text-sm text-text-secondary">
          💡 <span className="font-medium">Tip:</span> Connections are private to your account.
          Inroad accesses them only during research or when you draft outreach—never in the
          background.
        </p>
      </div>
    </div>
  );
}
