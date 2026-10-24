import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

/** A whole page with nothing to show: a failed load, no data yet, or setup
 * not finished. Every dashboard page uses this one shape for it. */
export function PageNotice({
  isError = false,
  title,
  action,
  children,
}: {
  isError?: boolean;
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card
      as="section"
      padding="none"
      role={isError ? "alert" : undefined}
      className="flex flex-col items-center gap-3 px-6 py-14 text-center"
    >
      {title ? (
        <h2 className="font-display text-xl font-sans-semibold tracking-heading text-ink">
          {title}
        </h2>
      ) : null}
      <p className="max-w-md text-sm leading-relaxed text-ink-muted">{children}</p>
      {action ? <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </Card>
  );
}

/** Profile and Settings both need a finished profile to show anything. */
export function SetupNotice({ subject }: { subject: string }) {
  return (
    <PageNotice
      title="Finish setting up first"
      action={
        <Button href="/onboarding" size="sm">
          Complete onboarding
        </Button>
      }
    >
      {`Complete onboarding to see your ${subject} here.`}
    </PageNotice>
  );
}
