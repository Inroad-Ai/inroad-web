import { PageShell } from "@/components/composed/dashboard/PageShell";
import { ResearchWorkspace } from "@/components/composed/dashboard/research/ResearchWorkspace";

export default function ResearchPage() {
  return (
    <PageShell
      title="Discover"
      description="Give Inroad a company website and it reads the site, the news, the people and the hiring signal, then writes you a brief. Or let your profile find companies for you."
      maxWidth={1040}
    >
      <ResearchWorkspace />
    </PageShell>
  );
}
