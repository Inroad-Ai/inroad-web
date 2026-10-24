import type { PersonDetail } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MessageIcon } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import type { UseOutreachDraftsResult } from "@/hooks/useOutreachDrafts";
import { OutreachDrafts } from "./OutreachDrafts";

export function OutreachComposer({
  detail,
  outreach,
}: {
  detail: PersonDetail;
  outreach: UseOutreachDraftsResult;
}) {
  const isClosed = detail.stage === "closed";
  const draftsProps = {
    drafts: outreach.drafts,
    personId: detail.id,
    personEmail: detail.email,
    personLinkedinUrl: detail.linkedin_url,
    onDraftFollowUp: outreach.draft,
    onSaved: outreach.replaceDraft,
  };

  return (
    <Card as="section" aria-label="Outreach" padding="none">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <Eyebrow as="span" dot="static">
          Outreach
        </Eyebrow>
      </header>

      <div className="p-5 sm:p-6">
        {outreach.error ? <Notice className="mb-4">{outreach.error}</Notice> : null}

        {isClosed ? (
          <>
            <p className="text-sm leading-6 text-ink-muted">
              Outreach is closed for this contact. Saved messages remain available as a record, but
              cannot be drafted, edited, or sent.
            </p>
            {outreach.drafts.length > 0 ? (
              <div className="mt-5">
                <OutreachDrafts {...draftsProps} drafting={false} readOnly />
              </div>
            ) : null}
          </>
        ) : outreach.drafts.length === 0 ? (
          <Card variant="nested" className="flex flex-col items-start">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-amber-subtle text-signal-amber">
              <MessageIcon />
            </span>
            <p className="mt-4 font-display text-xl font-sans-semibold tracking-heading text-ink">
              Ready to start a conversation
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
              Create a personalized email and LinkedIn message from this company&apos;s research and
              your profile.
            </p>
            <Button
              className="mt-5"
              size="sm"
              type="button"
              onClick={() => outreach.draft(0)}
              loading={outreach.drafting}
              disabled={outreach.loading}
            >
              {outreach.drafting ? "Drafting..." : "Draft outreach"}
            </Button>
          </Card>
        ) : (
          <>
            <p className="max-w-3xl text-sm leading-6 text-ink-muted">
              Review each touchpoint in order. Earlier messages provide context for every follow-up.
            </p>
            <div className="mt-5">
              <OutreachDrafts {...draftsProps} drafting={outreach.drafting} />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
