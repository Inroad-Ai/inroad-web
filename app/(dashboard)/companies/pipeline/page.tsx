import { PageShell } from "@/components/composed/dashboard/PageShell";
import { PipelineBoard } from "@/components/composed/dashboard/PipelineBoard";

export default function PipelinePage() {
  return (
    <PageShell
      title="Stages"
      description="Drag a card to move it, or use Move. Each column is a stage, from first look to offer."
    >
      <PipelineBoard />
    </PageShell>
  );
}
