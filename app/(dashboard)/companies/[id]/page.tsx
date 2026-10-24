import { CompanyReport } from "@/components/composed/dashboard/company-report/CompanyReport";
import { PageShell } from "@/components/composed/dashboard/PageShell";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/ui/Icons";

export default function CompanyReportPage({ params }: { params: { id: string } }) {
  return (
    <PageShell
      title="Company"
      description="Everything saved for this company, and what the last research run found."
      action={
        <Button href="/companies" variant="ghost" size="sm" icon={<ArrowLeftIcon />}>
          Back to companies
        </Button>
      }
    >
      <CompanyReport companyId={params.id} />
    </PageShell>
  );
}
