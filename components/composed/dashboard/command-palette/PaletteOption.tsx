import type { PaletteCommand } from "./palette.types";

export function PaletteOption({
  id,
  command,
  active,
  onHover,
  onSelect,
}: {
  id: string;
  command: PaletteCommand;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      onMouseMove={onHover}
      onClick={onSelect}
      className={`flex cursor-pointer items-center gap-3 rounded-nest px-3 py-2.5 text-sm font-sans-semibold text-ink transition-colors duration-fast ${
        active ? "bg-ink/10" : ""
      }`}
    >
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-ink-muted">
        {command.icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{command.label}</span>
      {command.hint ? (
        <span className="max-w-48 shrink-0 truncate text-xs font-sans-medium text-ink-faint">
          {command.hint}
        </span>
      ) : null}
    </div>
  );
}
