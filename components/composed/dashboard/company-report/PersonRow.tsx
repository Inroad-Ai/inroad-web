import Link from "next/link";

import { PERSON_ROLE_LABEL } from "@/lib/types";
import type { Person } from "@/lib/types";
import { Av, Tag } from "../v2/kit";
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
  const initials = person.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <tr>
      <td>
        <div className="row">
          <Av i={initials} c={(person.name.length % 6) + 1} size="xs" />
          <Link href={`/contacts/${person.id}`} className="m">
            {person.name}
          </Link>
          {isPrimary ? <Tag tone="amber">Primary</Tag> : null}
        </div>
      </td>
      <td className="muted">
        {person.title ?? <span className="faint">No title listed</span>}{" "}
        <Tag tone={HIGHLIGHTED_ROLES.has(person.role_category) ? "teal" : ""}>
          {PERSON_ROLE_LABEL[person.role_category]}
        </Tag>
      </td>
      <td>
        {person.email ? (
          <TextLink href={`mailto:${person.email}`}>{person.email}</TextLink>
        ) : (
          <span className="faint">No email</span>
        )}
        {person.linkedin_url ? (
          <>
            {" "}
            <span className="faint xs">·</span>{" "}
            <ExternalLink href={person.linkedin_url}>LinkedIn</ExternalLink>
          </>
        ) : null}
      </td>
      <td>
        <span className="row" style={{ gap: 10 }}>
          <PersonStageBadge stage={person.stage} />
          <PersonStageMenu
            name={person.name}
            stage={person.stage}
            disabled={pending}
            onMove={onStageChange}
          />
        </span>
      </td>
      <td style={{ textAlign: "right" }}>
        <Button
          variant={isPrimary ? "ghost" : "quiet"}
          size="sm"
          disabled={pending}
          onClick={onToggleContact}
        >
          {isPrimary ? "Unset contact" : "Set as contact"}
        </Button>
      </td>
    </tr>
  );
}
