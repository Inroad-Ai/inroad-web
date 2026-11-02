"use client";

import { useState } from "react";

import type { CompanyDetail } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import { DashboardPanel } from "../DashboardPanel";
import { ExternalLink } from "./ExternalLink";

// The API ranks closest to the person's target roles first; the top few are
// the ones worth reading, the rest are one click away.
const SHOWN_FIRST = 4;

export function FittingRolesSection({ detail }: { detail: CompanyDetail }) {
  const [expanded, setExpanded] = useState(false);
  const fitting = detail.fitting_roles ?? [];
  if (fitting.length === 0) return null;
  const shown = expanded ? fitting : fitting.slice(0, SHOWN_FIRST);

  return (
    <DashboardPanel
      title="Jobs here that fit you"
      meta={<span className="utility-label text-ink-faint">{fitting.length}</span>}
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {shown.map((role) => (
          <Card
            as="li"
            key={`${role.url ?? ""}|${role.title}|${role.reason}`}
            variant="nested"
            padding="sm"
          >
            <ExternalLink href={role.url} className="text-sm font-sans-semibold">
              {role.title}
            </ExternalLink>
            <p className="mt-1 text-xs text-ink-muted">{role.reason}</p>
          </Card>
        ))}
      </ul>
      {fitting.length > SHOWN_FIRST ? (
        <Button
          variant="quiet"
          size="sm"
          className="mt-4"
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? "Show fewer" : `Show all ${fitting.length} that fit`}
        </Button>
      ) : null}
    </DashboardPanel>
  );
}
