"use client";

import { Notice } from "@/components/ui/Notice";
import { useConnections } from "@/hooks/useConnections";
import type { Connection } from "@/lib/api-client/client";
import { DashboardPanel } from "../DashboardPanel";
import { PageNotice } from "../PageNotice";
import { AiModelsSection } from "./AiModelsSection";
import { ConnectorCard } from "./ConnectorCard";
import { IntegrationsSkeleton } from "./IntegrationsSkeleton";
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
    <div className="space-y-8">
      {redirectNotice ? (
        <Notice tone={redirectNotice.isError ? "error" : "success"} boxed>
          {redirectNotice.text}
        </Notice>
      ) : null}

      <p className="text-sm text-ink-muted">
        <span className="font-sans-semibold text-ink">
          {connectedCount} of {KNOWN_PROVIDERS.length}
        </span>{" "}
        connected. Each connection is optional, private to your account, and used only when you
        start research or draft outreach.
      </p>

      {providersByCategory().map(([category, providers]) => (
        <DashboardPanel
          key={category}
          id={`integrations-${category.toLowerCase().replace(/\s+/g, "-")}`}
          title={category}
          description={CATEGORY_DESCRIPTIONS[category] ?? ""}
        >
          <ul className="divide-y divide-line border-y border-line">
            {providers.map((entry) => (
              <ConnectorCard
                key={entry.provider}
                provider={entry.provider}
                label={entry.label}
                eyebrow={entry.eyebrow}
                description={entry.description}
                logoSrc={entry.logoSrc}
                authMode={entry.authMode}
                keyNote={entry.keyNote}
                connection={
                  connections.find((connection) => connection.provider === entry.provider) ?? null
                }
                onConnected={handleConnected}
                onDisconnected={handleDisconnected}
              />
            ))}
          </ul>

          {category === "AI models" ? <AiModelsSection connections={connections} /> : null}
        </DashboardPanel>
      ))}
    </div>
  );
}
