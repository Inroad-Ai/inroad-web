"use client";

import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";

interface ChartCardProps {
  title: string;
  eyebrow: string;
  description: string;
  aside?: string;
  children: ReactNode;
  table?: ReactNode;
}

export function ChartCard({ title, eyebrow, description, aside, children, table }: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <section className="min-w-0 rounded-md border border-line bg-surface p-5 shadow-card sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="utility-label text-signal-teal">{eyebrow}</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        </div>
        {aside ? <span className="text-sm text-text-secondary">{aside}</span> : null}
      </header>
      {table ? (
        <Button
          variant="quiet"
          size="sm"
          className="mt-4"
          aria-expanded={showTable}
          onClick={() => setShowTable((value) => !value)}
        >
          {showTable ? "View chart" : "View as table"}
        </Button>
      ) : null}
      <div className="mt-5">{showTable ? table : children}</div>
    </section>
  );
}
