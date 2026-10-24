import Link from "next/link";

import { PERSON_ROLE_LABEL } from "@/lib/types";
import type { Person } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PersonStageBadge, type PersonStage } from "@/components/ui/PersonStageBadge";
import { TextLink } from "@/components/ui/TextLink";

import { PersonStageMenu } from "../people/PersonStageMenu";
import { ExternalLink } from "./ExternalLink";

// Founders/co-founders/execs are the roles worth a second glance first;
// everyone else still shows, just without the highlight.
const HIGHLIGHTED_ROLES = new Set(["founder", "co_founder", "executive"]);

export function PersonRow({
  person,
  isPrimary,
  pending,
  onStageChange,
  onToggleContact,
}: {
  person: Person;
  isPrimary: boolean;
  pending: boolean;
  onStageChange: (stage: PersonStage) => void;
  onToggleContact: () => void;
}) {
  return (
    <li className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/contacts/${person.id}`}
            className="text-sm font-sans-semibold text-ink underline-offset-4 hover:underline"
          >
            {person.name}
          </Link>
          <Badge tone={HIGHLIGHTED_ROLES.has(person.role_category) ? "teal" : "neutral"}>
            {PERSON_ROLE_LABEL[person.role_category]}
          </Badge>
          {isPrimary ? <Badge tone="amber">Primary contact</Badge> : null}
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          {person.title ?? <span className="text-ink-faint">No title listed</span>}
        </p>
        {person.linkedin_url || person.email ? (
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {person.linkedin_url ? (
              <ExternalLink href={person.linkedin_url}>LinkedIn</ExternalLink>
            ) : null}
            {person.email ? (
              <TextLink href={`mailto:${person.email}`} className="break-all">
                {person.email}
              </TextLink>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <PersonStageBadge stage={person.stage} />
        <PersonStageMenu
          name={person.name}
          stage={person.stage}
          disabled={pending}
          onMove={onStageChange}
        />
        <Button
          variant={isPrimary ? "ghost" : "quiet"}
          size="sm"
          disabled={pending}
          onClick={onToggleContact}
        >
          {isPrimary ? "Unset contact" : "Set as contact"}
        </Button>
      </div>
    </li>
  );
}
