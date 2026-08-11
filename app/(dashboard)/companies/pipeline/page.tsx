import { PageShell } from "@/components/composed/dashboard/PageShell";
import { PipelineBoard } from "@/components/composed/dashboard/PipelineBoard";

export default function PipelinePage() {
  return (
    <PageShell
      title="Pipeline"
      description="Companies by stage, from first look to offer."
    >
      <PipelineBoard />
    </PageShell>
  );
}
