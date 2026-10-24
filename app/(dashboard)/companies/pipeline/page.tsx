import { PageShell } from "@/components/composed/dashboard/PageShell";
import { PipelineBoard } from "@/components/composed/dashboard/PipelineBoard";

export default function PipelinePage() {
  return (
    <PageShell
      title="Pipeline"
      description="Companies by stage, from first look to offer. Drag a card to a new stage, or use Move."
    >
      <PipelineBoard />
    </PageShell>
  );
}
