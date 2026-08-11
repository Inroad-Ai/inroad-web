import Link from "next/link";

import { CompanyProfile } from "@/components/composed/dashboard/CompanyProfile";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  return (
    <PageShell
      title="Company"
      description="Everything saved for this company, and what the last research run found."
      action={
        <Link
          href="/companies"
          className="text-sm text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
        >
          Back to companies
        </Link>
      }
    >
      <CompanyProfile companyId={params.id} />
    </PageShell>
  );
}
