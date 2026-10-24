import { formatTimestamp } from "@/lib/format";
import type { PersonDetail } from "@/lib/types";
import { DataField } from "@/components/ui/DataField";
import { TextLink } from "@/components/ui/TextLink";

import { ExternalLink } from "../company-report/ExternalLink";

function Missing({ children }: { children: string }) {
  return <span className="text-ink-faint">{children}</span>;
}

export function ContactFields({ detail }: { detail: PersonDetail }) {
  return (
    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
      <DataField label="Company">
        <TextLink href={`/companies/${detail.company_id}`}>
          {detail.company_homepage_title ?? detail.company_domain}
        </TextLink>
      </DataField>
      <DataField label="Email">
        {detail.email ? (
          <TextLink href={`mailto:${detail.email}`} className="break-all">
            {detail.email}
          </TextLink>
        ) : (
          <Missing>No public email found</Missing>
        )}
      </DataField>
      <DataField label="LinkedIn">
        {detail.linkedin_url ? (
          <ExternalLink href={detail.linkedin_url}>View profile</ExternalLink>
        ) : (
          <Missing>Not found</Missing>
        )}
      </DataField>
      <DataField label="Found via">{detail.source ?? <Missing>Unknown</Missing>}</DataField>
      <DataField label="Contacted">
        {detail.contacted_at ? formatTimestamp(detail.contacted_at) : <Missing>Not yet</Missing>}
      </DataField>
    </dl>
  );
}
