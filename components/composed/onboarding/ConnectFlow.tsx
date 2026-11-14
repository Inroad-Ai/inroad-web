"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useOAuthRedirectNotice } from "@/components/composed/dashboard/integrations/useOAuthRedirectNotice";
import { Notice } from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/Skeleton";
import { useConnections } from "@/hooks/useConnections";
import type { Connection } from "@/lib/api-client/client";

import { CONNECT_STEPS, connectStepFor } from "./connect-steps";
import { ConnectStep } from "./ConnectStep";
import { LaunchScreen } from "./LaunchScreen";
import {
  CONNECT_PHASE_INDEX,
  CONNECT_STEP_IDS,
  PHASES,
  STEP_IDS,
  TOTAL_STEPS,
  connectPhaseFill,
} from "./onboarding-steps";
import { ScreenShell } from "./ScreenShell";

interface StepNotice {
  text: string;
  isError: boolean;
}

/** The last part of setup, after the profile is saved: Gmail, then contact
 * data, each skippable, then the first match scan. */
export function ConnectFlow({ role, city }: { role: string; city: string }) {
  const searchParams = useSearchParams();
  const redirectNotice = useOAuthRedirectNotice();
  const { connections, setConnections, loading, error } = useConnections();
  // Back from an OAuth round trip: resume on the step that started it. Read
  // off the URL, since the notice above only arrives after the first render.
  const [stepIndex, setStepIndex] = useState(() => {
    const step = connectStepFor(searchParams.get("connected") ?? searchParams.get("provider"));
    return step ? CONNECT_STEP_IDS.indexOf(step) : 0;
  });
  const [direction, setDirection] = useState(1);
  const [notice, setNotice] = useState<StepNotice | null>(null);

  if (stepIndex >= CONNECT_STEP_IDS.length) {
    return <LaunchScreen role={role} city={city} />;
  }

  const step = CONNECT_STEP_IDS[stepIndex];

  function move(towards: number) {
    setNotice(null);
    setDirection(towards);
    setStepIndex((index) => Math.max(index + towards, 0));
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

  const shown =
    notice ??
    (redirectNotice && connectStepFor(redirectNotice.provider) === step ? redirectNotice : null);

  return (
    <ScreenShell
      stepKey={loading ? "loading" : step}
      direction={direction}
      step={STEP_IDS.length + stepIndex + 1}
      total={TOTAL_STEPS}
      phases={PHASES}
      fills={connectPhaseFill(stepIndex)}
      currentPhaseIndex={CONNECT_PHASE_INDEX}
    >
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <ConnectStep
          content={CONNECT_STEPS[step]}
          connections={connections}
          onConnected={handleConnected}
          onDisconnected={handleDisconnected}
          onNext={() => move(1)}
          onBack={stepIndex > 0 ? () => move(-1) : undefined}
          notice={
            error ? (
              <Notice boxed>{error}</Notice>
            ) : shown ? (
              <Notice tone={shown.isError ? "error" : "success"} boxed>
                {shown.text}
              </Notice>
            ) : null
          }
        />
      )}
    </ScreenShell>
  );
}
