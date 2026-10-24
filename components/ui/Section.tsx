import type { ReactNode } from "react";

import { Card } from "./Card";
import { Eyebrow } from "./Eyebrow";

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
    <Card as="section" padding="none">
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5">
        <Eyebrow as="span">{title}</Eyebrow>
        {meta}
      </header>
      <div className="px-6 pb-6 pt-4">{children}</div>
    </Card>
  );
}
