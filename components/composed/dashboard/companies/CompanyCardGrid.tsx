import { describeHiring } from "@/lib/companies";
import { formatRelativeDays } from "@/lib/format";
import type { Company } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TintBand } from "@/components/ui/TintBand";

const SKELETON_CARDS = 6;
const GRID = "grid gap-4 sm:grid-cols-2 xl:grid-cols-3";

export function CompanyCardGrid({
  companies,
  loading,
  onOpen,
}: {
  companies: Company[];
  loading: boolean;
  onOpen: (id: string) => void;
}) {
  if (loading) {
    return (
      <ul className={GRID} aria-hidden>
        {Array.from({ length: SKELETON_CARDS }).map((_, i) => (
          <Card as="li" key={i} padding="none" className="overflow-hidden">
            <div className="h-16 bg-ink/5" />
            <div className="flex flex-col gap-3 p-5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>
        ))}
      </ul>
    );
  }

  return (
    <ul className={GRID}>
      {companies.map((company) => (
        <li key={company.id} className="flex">
          <CompanyCard company={company} onOpen={() => onOpen(company.id)} />
        </li>
      ))}
    </ul>
  );
}

function CompanyCard({ company, onOpen }: { company: Company; onOpen: () => void }) {
  const hiring = describeHiring(company);
  const whyNow = company.profile?.why_reach_out_now ?? null;
  const summary = company.homepage_description ?? company.homepage_title;

  return (
    <Card
      as="article"
      variant="interactive"
      padding="none"
      role="button"
      tabIndex={0}
      aria-label={`Open ${company.domain}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      className="flex w-full cursor-pointer flex-col overflow-hidden"
    >
      <TintBand seed={company.domain} className="h-16 shrink-0">
        <div className="absolute -bottom-5 left-5">
          <CompanyLogo
            logoUrl={company.logo_url}
            seed={company.domain}
            size="lg"
            className="ring-4 ring-surface"
          />
        </div>
      </TintBand>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-8">
        <div className="min-w-0">
          <h3 className="truncate font-display text-xl font-sans-semibold tracking-heading text-ink">
            {company.domain}
          </h3>
          {summary ? (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-muted">{summary}</p>
          ) : null}
        </div>

        {whyNow ? (
          <Card variant="nested" padding="none" className="px-3 py-2.5">
            <p className="line-clamp-3 text-xs leading-relaxed text-ink-muted">
              <span className="font-sans-bold text-signal-teal">Why now</span> {whyNow}
            </p>
          </Card>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <StatusBadge stage={company.stage} />
          <Badge tone={hiring.muted ? "neutral" : "teal"}>{hiring.label}</Badge>
          <span className="utility-label ml-auto text-ink-faint">
            {formatRelativeDays(company.updated_at)}
          </span>
        </div>
      </div>
    </Card>
  );
}
