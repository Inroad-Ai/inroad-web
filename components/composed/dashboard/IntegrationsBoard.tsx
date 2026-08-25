"use client";

import { ConnectorCard } from "@/components/composed/dashboard/ConnectorCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useConnections } from "@/hooks/useConnections";
import type { Connection } from "@/lib/api-client/client";

// Lusha and ContactOut append here later - no backend change required, see
// schemas/connection.py's ConnectionProvider literal on the API side.
const KNOWN_PROVIDERS = [
  {
    provider: "apollo",
    label: "Apollo.io",
    description: "Fills in missing emails for people found via LinkedIn search.",
    logoSrc: "/logos/apollo.svg",
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

export function IntegrationsBoard() {
  const { connections, setConnections, loading, error } = useConnections();

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
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {KNOWN_PROVIDERS.map((entry) => (
        <ConnectorCard
          key={entry.provider}
          provider={entry.provider}
          label={entry.label}
          description={entry.description}
          logoSrc={entry.logoSrc}
          connection={connections.find((c) => c.provider === entry.provider) ?? null}
          onConnected={handleConnected}
          onDisconnected={handleDisconnected}
        />
      ))}
    </div>
  );
}
