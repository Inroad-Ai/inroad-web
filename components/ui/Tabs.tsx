export interface TabItem {
  id: string;
  label: string;
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
    <div role="tablist" className="flex flex-wrap gap-2 border-b border-line pb-3">
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
            className={`rounded-sm px-4 py-2 font-sans text-sm transition-colors ${
              active
                ? "bg-signal-teal-subtle text-text-primary"
                : item.disabled
                  ? "text-text-secondary/40"
                  : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
