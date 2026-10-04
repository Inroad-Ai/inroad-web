import type { CompanyDetail } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";

import { RunRow } from "./RunRow";

export function ResearchHistorySection({ detail }: { detail: CompanyDetail }) {
  return (
    <Section title="Latest research">
      {detail.recent_research_runs.length === 0 ? (
        <EmptyState>No research recorded for this company yet.</EmptyState>
      ) : (
        <ul className="divide-y divide-line">
          {detail.recent_research_runs.map((run) => (
            <RunRow key={run.id} run={run} />
          ))}
        </ul>
      )}
    </Section>
  );
}
