import Link from "next/link";

import { PROFILE_HREF } from "@/components/composed/dashboard/nav/nav.constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { CareerArcDocument } from "@/lib/api-client/client";
import { describeSize, hasContent } from "@/lib/career-arc";

export function CareerArcStatus({
  careerArc,
}: {
  careerArc: CareerArcDocument | null | undefined;
}) {
  const added = hasContent(careerArc);

  return (
    <Card
      variant="nested"
      padding="sm"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-sm font-sans-semibold text-ink">
          {added ? describeSize(careerArc) : "No career arc added"}
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Upload, edit or replace it in your{" "}
          <Link href={`${PROFILE_HREF}#profile-career-arc`} className="text-signal-teal">
            profile
          </Link>
          .
        </p>
      </div>
      <Badge tone={added ? "success" : "neutral"} dot={added}>
        {added ? "Added" : "Not added"}
      </Badge>
    </Card>
  );
}
