import { CompaniesTable } from "@/components/composed/dashboard/CompaniesTable";
import { PageShell } from "@/components/composed/dashboard/PageShell";
import { Button } from "@/components/ui/Button";

export default function CompaniesPage() {
  return (
    <PageShell
      title="Companies"
      description="Every company you've looked into, in one place."
      action={
        <Button href="/research" size="sm">
          Research a company
        </Button>
      }
    >
      <CompaniesTable />
    </PageShell>
  );
}
