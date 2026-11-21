import type { PersonDetail } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import type { UseOutreachDraftsResult } from "@/hooks/useOutreachDrafts";
import { OutreachDrafts } from "./OutreachDrafts";

function outreachTitle(name: string, hasDrafts: boolean): string {
  const first = name.split(" ")[0];
  return hasDrafts ? `Outreach to ${first}` : `Start a conversation with ${first}`;
}

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
    <section aria-label="Outreach">
      <div className="sm faint" style={{ marginBottom: 8 }}>
        People / {detail.name}
      </div>
      <h1 className="t" style={{ fontSize: 30, marginBottom: 6 }}>
        {outreachTitle(detail.name, outreach.drafts.length > 0)}
      </h1>
      <div className="row wrap" style={{ gap: 12, margin: "16px 0 4px" }}>
        <span className="faint sm" style={{ width: 56 }}>
          To
        </span>
        <span className="row" style={{ gap: 8 }}>
          <span>{detail.name}</span>
          <span className="faint">{detail.email ?? "No email found yet"}</span>
        </span>
      </div>

      <div>
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
          <div className="flex flex-col items-start border-y border-line py-6">
            <p className="font-display text-xl font-sans-semibold tracking-heading text-ink">
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
          </div>
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
    </section>
  );
}
