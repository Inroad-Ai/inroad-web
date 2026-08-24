import Link from "next/link";

import { ContactProfile } from "@/components/composed/dashboard/contact-profile/ContactProfile";
import { PageShell } from "@/components/composed/dashboard/PageShell";

export default function ContactProfilePage({ params }: { params: { id: string } }) {
  return (
    <PageShell
      title="Contact"
      description="Everything found about this person, and their outreach progress."
      action={
        <Link
          href="/contacts"
          className="text-sm text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
        >
          Back to contacts
        </Link>
      }
    >
      <ContactProfile personId={params.id} />
    </PageShell>
  );
}
