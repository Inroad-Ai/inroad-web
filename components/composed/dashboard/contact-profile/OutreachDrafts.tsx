"use client";

import { useState } from "react";

import type { OutreachChannel, OutreachDraft } from "@/lib/api-client/client";
import { Button } from "@/components/ui/Button";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { useSettings } from "@/hooks/useSettings";
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
      ? `Goes to ${email}. Sends from your own Gmail, or save it to your drafts to review there first.`
      : "No email found for this person yet. Try Find contact info above.";
  }
  return linkedinUrl
    ? "Paste this into a DM on their LinkedIn profile."
    : "No LinkedIn profile found for this person yet.";
}

function tabLabel(sequenceIndex: number): string {
  return sequenceIndex === 0 ? "Initial" : `Follow-up ${sequenceIndex}`;
}

export function OutreachDrafts({
  drafts,
  personId,
  personEmail,
  personLinkedinUrl,
  drafting,
  onDraftFollowUp,
  onSaved,
}: {
  drafts: OutreachDraft[];
  personId: string;
  personEmail: string | null;
  personLinkedinUrl: string | null;
  /** Disables the "Draft follow-up" button while any draft call is in
   * flight - there is only ever one reachable undrafted tab at a time. */
  drafting: boolean;
  onDraftFollowUp: (sequenceIndex: number) => void;
  onSaved: (draft: OutreachDraft) => void;
}) {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState("0");

  // Nothing to tab between before the first draft exists - the "Outreach"
  // button above this is still the only way in.
  if (drafts.length === 0) return null;

  const draftedSequenceIndexes = Array.from(new Set(drafts.map((d) => d.sequence_index))).sort(
    (a, b) => a - b,
  );
  const highestDrafted = draftedSequenceIndexes[draftedSequenceIndexes.length - 1];
  // Unioned with what's already drafted so downgrading cadence never hides
  // a follow-up written under a higher one.
  const maxSequenceIndex = Math.max(settings?.max_sequence_index ?? 0, highestDrafted);

  const tabs: TabItem[] = Array.from({ length: maxSequenceIndex + 1 }, (_, sequenceIndex) => ({
    id: String(sequenceIndex),
    label: tabLabel(sequenceIndex),
    // Follow-ups draft in order - a tab is reachable once the one before it
    // has a draft, same rule the backend enforces.
    disabled: sequenceIndex > 0 && !draftedSequenceIndexes.includes(sequenceIndex - 1),
  }));

  const activeSequenceIndex = Number(activeTab);
  const activeDrafts = drafts.filter((draft) => draft.sequence_index === activeSequenceIndex);

  return (
    <div className="flex flex-col gap-4">
      <Tabs items={tabs} activeId={activeTab} onChange={setActiveTab} />

      {activeDrafts.length > 0 ? (
        CHANNEL_ORDER.map((channel) => {
          const draft = activeDrafts.find((candidate) => candidate.channel === channel);
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
        })
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-md border border-line bg-surface p-6">
          <p className="text-sm text-text-secondary">
            Written with the earlier messages in this sequence as context, shorter and more
            direct than the last one.
          </p>
          <Button
            size="sm"
            type="button"
            onClick={() => onDraftFollowUp(activeSequenceIndex)}
            disabled={drafting}
          >
            {drafting ? "Drafting..." : `Draft follow-up ${activeSequenceIndex}`}
          </Button>
        </div>
      )}
    </div>
  );
}
