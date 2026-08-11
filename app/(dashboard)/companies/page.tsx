import { CompaniesTable } from "@/components/composed/dashboard/CompaniesTable";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function CompaniesPage() {
  return (
    <PageShell
      title="Companies"
      description="Every company you've looked into, in one table."
    >
      <CompaniesTable />
    </PageShell>
  );
}
