import { PageShell } from "@/components/composed/dashboard/PageShell";
import { PipelineBoard } from "@/components/composed/dashboard/PipelineBoard";

export default function PipelinePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <PageShell title="Pipeline" description="Companies by stage, from first look to offer.">
      <PipelineBoard key={JSON.stringify(searchParams)} initialFilters={searchParams} />
    </PageShell>
  );
}
