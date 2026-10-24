import type { SourcedPerson } from "@/lib/types";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { ExternalLink } from "./ExternalLink";

export function SourcedPeopleList({ people }: { people: SourcedPerson[] }) {
  if (people.length === 0) return null;
  return (
    <div>
      <Eyebrow as="h3">People listed on the company&apos;s site</Eyebrow>
      <ul className="mt-2 space-y-2">
        {people.map((person, index) => (
          <li key={`${person.name}-${index}`} className="text-sm text-ink">
            <span className="font-sans-semibold">{person.name}</span>
            {person.title ? <span className="text-ink-muted">, {person.title}</span> : null}
            {person.page_url ? (
              <>
                {" "}
                <ExternalLink href={person.page_url} className="text-xs">
                  source
                </ExternalLink>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
