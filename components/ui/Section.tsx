import type { ReactNode } from "react";

/** A titled card. `meta` sits opposite the title in the header row. */
export function Section({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md border border-line bg-surface shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        <span className="utility-label text-text-secondary">{title}</span>
        {meta}
      </header>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}
