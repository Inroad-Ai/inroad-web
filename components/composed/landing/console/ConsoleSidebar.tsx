import { ChatIcon, PlusIcon, SparkIcon } from "@/components/ui/Icons";

const HISTORY = [
  {
    group: "Today",
    items: [
      { label: "Series B fintechs in Berlin", current: true },
      { label: "Who hires backend at Tessellate?" },
      { label: "What changed at Gridlight" },
    ],
  },
  {
    group: "This week",
    items: [{ label: "Draft a follow-up to Priya" }, { label: "Remote-first infra teams" }],
  },
] as const;

/** Decorative question history; the console itself is the interactive part. */
export function ConsoleSidebar() {
  return (
    <aside
      aria-hidden
      className="hidden min-w-0 flex-col gap-1 border-r border-line bg-ink/5 px-3 py-4 md:flex"
    >
      <div className="mb-3.5 flex h-9 items-center gap-2 rounded-nest bg-surface px-3 text-sm font-sans-semibold text-ink shadow-nest">
        <PlusIcon />
        New question
      </div>
      {HISTORY.map(({ group, items }) => (
        <div key={group} className="flex flex-col gap-1">
          <p className="utility-label px-2.5 pb-1.5 pt-2.5 text-ink-faint">{group}</p>
          {items.map((item) => {
            const current = "current" in item && item.current;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-2 rounded-nest px-2.5 py-2 text-sm text-ink-muted ${
                  current ? "bg-surface text-ink shadow-nest" : ""
                }`}
              >
                <span className="text-ink-faint">
                  {current ? (
                    <SparkIcon className="h-3.5 w-3.5" />
                  ) : (
                    <ChatIcon className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
            );
          })}
        </div>
      ))}
      <div className="mt-auto rounded-nest bg-surface-raised p-3 text-xs text-ink-muted">
        <p className="mb-1.5 text-sm font-sans-semibold text-ink">Jordan&apos;s profile</p>
        Backend · Go · Berlin
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full w-3/5 bg-gradient-to-r from-signal-teal to-signal-amber" />
        </div>
      </div>
    </aside>
  );
}
