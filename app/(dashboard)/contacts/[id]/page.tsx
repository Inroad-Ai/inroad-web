import { ContactProfile } from "@/components/composed/dashboard/contact-profile/ContactProfile";
import { PageShell } from "@/components/composed/dashboard/PageShell";
import { Btn } from "@/components/composed/dashboard/v2/kit";

export default async function ContactProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageShell
      title="Contact"
      description="Contact details, engagement status, and outreach sequence."
      action={
        <Btn kind="t" icon="arrow" href="/contacts">
          Back to people
        </Btn>
      }
    >
      <ContactProfile personId={id} />
    </PageShell>
  );
}
