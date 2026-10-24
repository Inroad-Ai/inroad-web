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
    <div className={LAYOUT}>
      <div className="flex min-w-0 flex-col gap-6">
        <ContactHeaderCard
          detail={detail}
          moving={contact.moving}
          moveError={contact.moveError}
          enriching={contact.enriching}
          enrichMessage={contact.enrichMessage}
          onMoveStage={contact.moveStage}
          onEnrich={contact.enrichContact}
        />
        <EngagementHistory detail={detail} drafts={outreach.drafts} />
      </div>

      <div className="min-w-0 lg:col-span-2">
        <OutreachComposer detail={detail} outreach={outreach} />
      </div>
    </div>
  );
}
