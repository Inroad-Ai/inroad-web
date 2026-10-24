import { ContactProfile } from "@/components/composed/dashboard/contact-profile/ContactProfile";
import { PageShell } from "@/components/composed/dashboard/PageShell";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/ui/Icons";

export default function ContactProfilePage({ params }: { params: { id: string } }) {
  return (
    <PageShell
      title="Contact profile"
      description="Contact details, engagement status, and outreach sequence."
      action={
        <Button href="/contacts" variant="ghost" size="sm" icon={<ArrowLeftIcon />}>
          Back to people
        </Button>
      }
    >
      <ContactProfile personId={params.id} />
    </PageShell>
  );
}
