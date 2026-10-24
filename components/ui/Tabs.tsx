import type { IconComponent } from "./Icons";

export interface TabItem {
  id: string;
  label: string;
  icon?: IconComponent;
  disabled?: boolean;
}

/** A tab strip only - the caller owns what renders below it, so this stays
 * reusable for anything that needs to switch between a small fixed set of
 * views. */
export function Tabs({
  items,
  activeId,
  onChange,
}: {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      className="inline-flex max-w-full flex-wrap gap-0.5 rounded-full border border-line bg-ink/5 p-1"
    >
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 font-sans text-sm font-sans-semibold transition duration-fast ease-standard ${
              active
                ? "bg-surface text-ink shadow-nest"
                : item.disabled
                  ? "cursor-not-allowed text-ink-faint/60"
                  : "text-ink-muted hover:text-ink"
            }`}
          >
            {item.icon ? <item.icon /> : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
