import {
  DocIcon,
  EditIcon,
  SearchIcon,
  SparkIcon,
  UserIcon,
  type IconComponent,
} from "@/components/ui/Icons";
import type { AnswerChip, AnswerIcon } from "@/lib/landing/ask-types";

const ICONS: Record<AnswerIcon, IconComponent> = {
  edit: EditIcon,
  doc: DocIcon,
  user: UserIcon,
  search: SearchIcon,
  spark: SparkIcon,
};

/** Follow-up actions under an answer. Each one asks the console a question. */
export function AnswerChips({
  chips,
  active,
  targetPrefix,
  onPress,
}: {
  chips: readonly AnswerChip[];
  active: number | null;
  targetPrefix: string;
  onPress: (index: number) => void;
}) {
  if (!chips.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {chips.map((chip, i) => {
        const isActive = active === i;
        const ChipIcon = ICONS[chip.icon];
        return (
          <button
            key={chip.label}
            type="button"
            data-demo-target={`${targetPrefix}-${i}`}
            aria-pressed={isActive}
            onClick={() => onPress(i)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-sans-medium transition duration-fast ease-standard active:scale-95 ${
              isActive
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 bg-ink/5 text-ink hover:border-ink/25 hover:bg-ink/10"
            }`}
          >
            <span className={isActive ? "text-paper" : "text-ink-muted"}>
              <ChipIcon className="h-3.5 w-3.5" />
            </span>
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
