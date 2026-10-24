"use client";

import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Notice } from "@/components/ui/Notice";
import { useConnections } from "@/hooks/useConnections";
import type { Connection } from "@/lib/api-client/client";
import { PageNotice } from "../PageNotice";
import { ConnectorCard } from "./ConnectorCard";
import { IntegrationsSkeleton } from "./IntegrationsSkeleton";
import { IntegrationsSummary } from "./IntegrationsSummary";
import { CATEGORY_DESCRIPTIONS, KNOWN_PROVIDERS, providersByCategory } from "./providers";
import { useOAuthRedirectNotice } from "./useOAuthRedirectNotice";

export function IntegrationsBoard() {
  const { connections, setConnections, loading, error } = useConnections();
  const redirectNotice = useOAuthRedirectNotice();

  if (loading) return <IntegrationsSkeleton />;
  if (error) {
    return <PageNotice isError>{error}</PageNotice>;
  }

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
    <div className="space-y-10">
      {redirectNotice ? (
        <Notice tone={redirectNotice.isError ? "error" : "success"} boxed>
          {redirectNotice.text}
        </Notice>
      ) : null}

      <IntegrationsSummary connected={connectedCount} total={KNOWN_PROVIDERS.length} />

      {providersByCategory().map(([category, providers]) => {
        const headingId = `integrations-${category.toLowerCase().replace(/\s+/g, "-")}`;
        return (
          <section key={category} aria-labelledby={headingId}>
            <div className="mb-5">
              <Eyebrow as="h2" dot="static">
                <span id={headingId}>{category}</span>
              </Eyebrow>
              <p className="mt-2 text-sm text-ink-muted">{CATEGORY_DESCRIPTIONS[category] ?? ""}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {providers.map((entry) => (
                <ConnectorCard
                  key={entry.provider}
                  provider={entry.provider}
                  label={entry.label}
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
        );
      })}

      <Card variant="nested" padding="sm">
        <p className="text-sm text-ink-muted">
          <span className="font-sans-semibold text-ink">Tip:</span> Connections are private to your
          account. Inroad accesses them only during research or when you draft outreach, never in
          the background.
        </p>
      </Card>
    </div>
  );
}
