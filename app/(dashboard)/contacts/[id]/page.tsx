import { ContactProfile } from "@/components/composed/dashboard/contact-profile/ContactProfile";

export default async function ContactProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContactProfile personId={id} />;
}
