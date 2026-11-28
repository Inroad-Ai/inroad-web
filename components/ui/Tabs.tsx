import type { IconComponent } from "./Icons";

export interface TabItem {
  id: string;
  label: string;
  icon?: IconComponent;
  disabled?: boolean;
  /** A quiet number after the label, for the size of what the tab holds. */
  count?: number;
}

type Variant = "segmented" | "underline";

const LIST: Record<Variant, string> = {
  segmented:
    "inline-flex max-w-full flex-wrap gap-0.5 rounded-full border border-line bg-ink/5 p-1",
  underline: "flex max-w-full flex-wrap gap-1 border-b border-line",
};

const TAB: Record<Variant, string> = {
  segmented: "h-8 rounded-full px-3.5 font-sans-semibold transition duration-fast ease-standard",
  underline:
    "relative h-10 px-3 font-sans-medium transition-colors duration-fast ease-standard after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full",
};

const ACTIVE: Record<Variant, string> = {
  segmented: "bg-surface text-ink shadow-nest",
  underline: "text-ink after:bg-ink",
};

/** A tab strip only - the caller owns what renders below it, so this stays
 * reusable for anything that needs to switch between a small fixed set of
 * views. `underline` is the quiet text style for page-level views. */
export function Tabs({
  items,
  activeId,
  onChange,
  variant = "segmented",
}: {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: Variant;
}) {
  return (
    <div role="tablist" className={LIST[variant]}>
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
            className={`inline-flex items-center gap-1.5 font-sans text-sm ${TAB[variant]} ${
              active
                ? ACTIVE[variant]
                : item.disabled
                  ? "cursor-not-allowed text-ink-faint/60"
                  : "text-ink-muted hover:text-ink"
            }`}
          >
            {item.icon ? <item.icon /> : null}
            {item.label}
            {item.count !== undefined ? (
              <span className="text-xs text-ink-faint">{item.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
