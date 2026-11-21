import { CompanyReport } from "@/components/composed/dashboard/company-report/CompanyReport";

export default async function CompanyReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CompanyReport companyId={id} />;
}
