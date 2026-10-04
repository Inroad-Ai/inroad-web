import { CompaniesTable } from "@/components/composed/dashboard/CompaniesTable";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function CompaniesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <PageShell title="Companies" description="Every company you've looked into, in one table.">
      <CompaniesTable key={JSON.stringify(searchParams)} initialFilters={searchParams} />
    </PageShell>
  );
}
