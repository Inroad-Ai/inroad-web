"use client";

import type { ReactNode } from "react";

import { ConnectorCard } from "@/components/composed/dashboard/integrations/ConnectorCard";
import { KNOWN_PROVIDERS } from "@/components/composed/dashboard/integrations/providers";
import type { Connection } from "@/lib/api-client/client";

import type { ConnectStepContent } from "./connect-steps";
import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

/** One optional connect step: why it matters, the provider cards, and where
 * to find it later. Continue reads as Skip until something is connected. */
export function ConnectStep({
  content,
  connections,
  onConnected,
  onDisconnected,
  onNext,
  onBack,
  notice,
}: {
  content: ConnectStepContent;
  connections: Connection[];
  onConnected: (connection: Connection) => void;
  onDisconnected: (provider: string) => void;
  onNext: () => void;
  onBack?: () => void;
  notice?: ReactNode;
}) {
  const entries = KNOWN_PROVIDERS.filter((entry) => content.providers.includes(entry.provider));
  const connectionFor = (provider: string) =>
    connections.find((connection) => connection.provider === provider) ?? null;
  const hasConnected = entries.some(
    (entry) => connectionFor(entry.provider)?.status === "connected",
  );

  return (
    <div>
      <StepHeading
        title={content.title}
        aside={<span className="utility-label text-ink-faint">Optional</span>}
      >
        {content.why}
      </StepHeading>

      {notice ? <div className="mt-5">{notice}</div> : null}

      <div className={`mt-7 grid gap-3 ${entries.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {entries.map((entry) => (
          <ConnectorCard
            key={entry.provider}
            provider={entry.provider}
            label={entry.label}
            eyebrow={entry.eyebrow}
            description={entry.description}
            logoSrc={entry.logoSrc}
            authMode={entry.authMode}
            keyNote={entry.keyNote}
            connection={connectionFor(entry.provider)}
            onConnected={onConnected}
            onDisconnected={onDisconnected}
            oauthReturnTo="onboarding"
            nested
          />
        ))}
      </div>

      <p className="mt-5 text-sm text-ink-muted">{content.later}</p>

      <StepFooter
        onBack={onBack}
        onPrimary={onNext}
        primaryLabel={hasConnected ? "Continue" : "Skip for now"}
      />
    </div>
  );
}
