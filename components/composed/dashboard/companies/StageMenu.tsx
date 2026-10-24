import type { ReactNode } from "react";

import { Menu } from "@/components/ui/Menu";
import { PIPELINE_STAGES, StatusBadge, type PipelineStage } from "@/components/ui/StatusBadge";

/** Every stage as a badge, the current one disabled. The dossier and the
 * pipeline both move companies through this one menu. */
export function StageMenu({
  label,
  trigger,
  current,
  disabled = false,
  align = "right",
  onSelect,
}: {
  label: string;
  trigger: ReactNode;
  current: PipelineStage;
  disabled?: boolean;
  align?: "left" | "right";
  onSelect: (stage: PipelineStage) => void;
}) {
  return (
    <Menu
      label={label}
      trigger={trigger}
      disabled={disabled}
      align={align}
      items={PIPELINE_STAGES.map((stage) => ({
        key: stage,
        label: <StatusBadge stage={stage} />,
        disabled: stage === current,
        onSelect: () => onSelect(stage),
      }))}
    />
  );
}
