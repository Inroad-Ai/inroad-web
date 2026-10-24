import Link from "next/link";

import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import type { ResearchRun } from "@/lib/research-runs";

import { StatusIcon } from "./StatusIcon";

function runDescription(run: ResearchRun): string {
  if (run.state === "pending") return "Research in progress";
  if (run.state === "failed") return "Research needs attention";
  return "Research brief ready";
}

export function ResearchRunRow({ run }: { run: ResearchRun }) {
  const isReady = run.state === "done";
  const error = run.state === "failed" ? run.error : null;

  const content = (
    <div className="px-2 py-3.5">
      <div className="flex items-center gap-3">
        <CompanyLogo logoUrl={null} seed={run.domain} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-sans-semibold text-ink">{run.domain}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{runDescription(run)}</p>
        </div>
        {isReady ? (
          <span className="utility-label inline-flex shrink-0 items-center gap-1.5 text-signal-teal">
            Open brief
            <ArrowRightIcon />
          </span>
        ) : (
          <StatusIcon state={run.state} />
        )}
      </div>
      {error ? (
        <Notice boxed className="mt-3">
          {error}
        </Notice>
      ) : null}
    </div>
  );

  return (
    <li>
      {isReady && run.companyId ? (
        <Link
          href={`/companies/${run.companyId}`}
          className="block rounded-nest transition-colors duration-fast hover:bg-ink/5"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}
