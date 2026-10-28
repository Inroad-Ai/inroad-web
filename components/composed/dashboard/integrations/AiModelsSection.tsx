"use client";

import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Notice } from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLlmAssignments } from "@/hooks/useLlmAssignments";
import type { Connection, LlmAssignment } from "@/lib/api-client/client";
import { LLM_PURPOSES } from "@/lib/llm-purposes";
import { LlmAssignmentRow } from "./LlmAssignmentRow";

/** The "which feature uses your key" panel: one row per purpose, sitting
 * under the AI-model key cards. Connections come from the board so a key
 * saved above immediately shows as selectable here. */
export function AiModelsSection({ connections }: { connections: Connection[] }) {
  const { assignments, setAssignments, loading, error } = useLlmAssignments();

  function assignmentFor(purpose: string): LlmAssignment | null {
    return assignments.find((entry) => entry.purpose === purpose) ?? null;
  }

  function handleSaved(saved: LlmAssignment) {
    setAssignments([...assignments.filter((entry) => entry.purpose !== saved.purpose), saved]);
  }

  function handleCleared(purpose: string) {
    setAssignments(assignments.filter((entry) => entry.purpose !== purpose));
  }

  return (
    <Card as="section" className="mt-4" aria-label="Which feature uses your key">
      <Eyebrow as="h3" dot="static">
        Which feature uses your key
      </Eyebrow>
      <p className="mt-2 text-sm text-ink-muted">
        Pick a connected provider to use your own key for a feature. Platform default uses
        Inroad&apos;s model with no extra setup.
      </p>

      <div className="mt-5">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : error ? (
          <Notice boxed>{error}</Notice>
        ) : (
          <div className="space-y-5">
            {LLM_PURPOSES.map((purpose) => (
              <LlmAssignmentRow
                key={purpose.id}
                purpose={purpose}
                assignment={assignmentFor(purpose.id)}
                connections={connections}
                onSaved={handleSaved}
                onCleared={() => handleCleared(purpose.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
