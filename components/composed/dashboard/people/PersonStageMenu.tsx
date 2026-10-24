import { Menu } from "@/components/ui/Menu";
import {
  PERSON_STAGES,
  PersonStageBadge,
  type PersonStage,
} from "@/components/ui/PersonStageBadge";

export function PersonStageMenu({
  name,
  stage,
  trigger = "Move",
  disabled = false,
  onMove,
}: {
  name: string;
  stage: PersonStage;
  trigger?: string;
  disabled?: boolean;
  onMove: (to: PersonStage) => void;
}) {
  return (
    <Menu
      label={`Move ${name} to another stage`}
      trigger={trigger}
      disabled={disabled}
      items={PERSON_STAGES.map((option) => ({
        key: option,
        label: <PersonStageBadge stage={option} />,
        disabled: option === stage,
        onSelect: () => onMove(option),
      }))}
    />
  );
}
