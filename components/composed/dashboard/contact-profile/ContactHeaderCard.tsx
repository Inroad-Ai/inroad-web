import { PERSON_ROLE_LABEL, type PersonDetail, type PersonStage } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { SearchIcon } from "@/components/ui/Icons";
import { PersonStageBadge } from "@/components/ui/PersonStageBadge";
import { PersonStageMenu } from "../people/PersonStageMenu";
import { ContactFields } from "./ContactFields";
import type { StatusMessage } from "./useContactPerson";

export function ContactHeaderCard({
  detail,
  moving,
  moveError,
  enriching,
  enrichMessage,
  onMoveStage,
  onEnrich,
}: {
  detail: PersonDetail;
  moving: boolean;
  moveError: string;
  enriching: boolean;
  enrichMessage: StatusMessage | null;
  onMoveStage: (stage: PersonStage) => void;
  onEnrich: () => void;
}) {
  const hasAllContactInfo = Boolean(detail.email) && Boolean(detail.linkedin_url);

  return (
    <Card as="section" aria-label="Contact" className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <Avatar name={detail.name} size="xl" />
        <PersonStageMenu
          name={detail.name}
          stage={detail.stage}
          trigger={moving ? "Moving..." : "Move stage"}
          disabled={moving}
          onMove={onMoveStage}
        />
      </div>

      <div className="min-w-0">
        <h2 className="break-words font-display text-2xl font-sans-semibold tracking-heading text-ink">
          {detail.name}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          {detail.title ?? "Title not listed"} at{" "}
          {detail.company_homepage_title ?? detail.company_domain}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{PERSON_ROLE_LABEL[detail.role_category]}</Badge>
          <PersonStageBadge stage={detail.stage} />
        </div>
        {moveError ? <Notice className="mt-3">{moveError}</Notice> : null}
      </div>

      <div className="border-t border-line pt-5">
        <ContactFields detail={detail} />
      </div>

      <div className="border-t border-line pt-5">
        <Button
          variant="quiet"
          size="sm"
          type="button"
          icon={<SearchIcon />}
          onClick={onEnrich}
          loading={enriching}
          disabled={hasAllContactInfo}
        >
          {enriching ? "Looking up..." : "Find contact info"}
        </Button>
        {enrichMessage ? (
          <Notice tone={enrichMessage.isError ? "error" : "neutral"} size="xs" className="mt-3">
            {enrichMessage.text}
          </Notice>
        ) : hasAllContactInfo ? (
          <p className="mt-3 text-xs text-ink-faint">
            This contact already has an email and LinkedIn profile.
          </p>
        ) : null}
      </div>
    </Card>
  );
}
