"use client";

import type { OutreachChannel, OutreachDraft } from "@/lib/api-client/client";
import { OutreachDraftSection } from "./OutreachDraftSection";

const TITLES: Record<OutreachChannel, string> = {
  email: "Email draft",
  linkedin: "LinkedIn message",
};

/** Fixed rather than taken from the response order: these are two sections
 * on a page, and which one comes first shouldn't move with a sort. */
const CHANNEL_ORDER: OutreachChannel[] = ["email", "linkedin"];

function hint(channel: OutreachChannel, email: string | null, linkedinUrl: string | null): string {
  if (channel === "email") {
    return email
      ? `Goes to ${email}. Sending from Inroad isn't wired up yet, so copy it into your mail client.`
      : "No email found for this person yet. Try Find contact info above.";
  }
  return linkedinUrl
    ? "Paste this into a DM on their LinkedIn profile."
    : "No LinkedIn profile found for this person yet.";
}

export function OutreachDrafts({
  drafts,
  personId,
  personEmail,
  personLinkedinUrl,
  onSaved,
}: {
  drafts: OutreachDraft[];
  personId: string;
  personEmail: string | null;
  personLinkedinUrl: string | null;
  onSaved: (draft: OutreachDraft) => void;
}) {
  return (
    <>
      {CHANNEL_ORDER.map((channel) => {
        const draft = drafts.find((candidate) => candidate.channel === channel);
        if (!draft) return null;
        return (
          <OutreachDraftSection
            key={draft.id}
            draft={draft}
            personId={personId}
            recipientEmail={personEmail}
            title={TITLES[channel]}
            hint={hint(channel, personEmail, personLinkedinUrl)}
            onSaved={onSaved}
          />
        );
      })}
    </>
  );
}
