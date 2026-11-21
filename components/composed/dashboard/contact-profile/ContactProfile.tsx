"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { useOutreachDrafts } from "@/hooks/useOutreachDrafts";
import { PageNotice } from "../PageNotice";
import { ContactHeaderCard } from "./ContactHeaderCard";
import { EngagementHistory } from "./EngagementHistory";
import { OutreachComposer } from "./OutreachComposer";
import { useContactPerson } from "./useContactPerson";

const LAYOUT = "grid items-start gap-6 lg:grid-cols-3";

export function ContactProfile({ personId }: { personId: string }) {
  const contact = useContactPerson(personId);
  const outreach = useOutreachDrafts(personId);
  const { detail } = contact;

  if (contact.loadState === "loading") {
    return (
      <div className={LAYOUT} role="status" aria-label="Loading contact profile">
        <div className="space-y-6">
          <Skeleton className="h-96 w-full rounded-card" />
          <Skeleton className="h-48 w-full rounded-card" />
        </div>
        <Skeleton className="h-96 w-full rounded-card lg:col-span-2" />
        <span className="sr-only">Loading this contact...</span>
      </div>
    );
  }

  if (contact.loadState === "error" || detail === null) {
    return <PageNotice isError>{contact.loadError}</PageNotice>;
  }

  return (
    <div className="split" style={{ display: "flex", gap: 46 }}>
      <div style={{ flex: 1, maxWidth: 760, minWidth: 0 }}>
        <OutreachComposer detail={detail} outreach={outreach} />
      </div>

      <div
        className="aside"
        style={{
          width: 320,
          flex: "none",
          paddingLeft: 34,
          borderLeft: "1px solid rgb(var(--color-line))",
          marginTop: 6,
        }}
      >
        <ContactHeaderCard
          detail={detail}
          moving={contact.moving}
          moveError={contact.moveError}
          enriching={contact.enriching}
          enrichMessage={contact.enrichMessage}
          onMoveStage={contact.moveStage}
          onEnrich={contact.enrichContact}
        />
        <div style={{ marginTop: 28 }}>
          <EngagementHistory detail={detail} drafts={outreach.drafts} />
        </div>
      </div>
    </div>
  );
}
