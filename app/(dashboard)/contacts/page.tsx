import { ContactsBoard } from "@/components/composed/dashboard/ContactsBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function ContactsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <PageShell
      title="People"
      description="People found across your researched companies, by outreach stage."
    >
      <ContactsBoard key={JSON.stringify(searchParams)} initialFilters={searchParams} />
    </PageShell>
  );
}
