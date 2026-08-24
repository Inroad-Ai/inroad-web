import { ContactsBoard } from "@/components/composed/dashboard/ContactsBoard";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function ContactsPage() {
  return (
    <PageShell
      title="Contacts"
      description="People found across your researched companies, by outreach stage."
    >
      <ContactsBoard />
    </PageShell>
  );
}
