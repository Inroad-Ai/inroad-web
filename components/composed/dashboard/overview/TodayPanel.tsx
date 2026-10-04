import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import type { OverviewActions } from "@/lib/api-client/client";
import { formatRelativeDays, MILLISECONDS_PER_DAY } from "@/lib/format";

interface TodayAction {
  id: string;
  title: string;
  reason: string;
  domain: string;
  logoUrl: string | null;
  href: string;
  button: string;
}

const VISIBLE_ACTIONS = 5;

function actionRows(data: OverviewActions): TodayAction[] {
  const groups: TodayAction[][] = [
    data.follow_up_companies.map((company) => ({
      id: `company-follow-up-${company.id}`,
      title: company.homepage_title || company.domain,
      reason: `Last updated ${formatRelativeDays(company.updated_at)}. No reply yet.`,
      domain: company.domain,
      logoUrl: company.logo_url ?? null,
      href: `/companies/${company.id}`,
      button: "Open",
    })),
    data.follow_up_people.map((person) => ({
      id: `person-follow-up-${person.id}`,
      title: person.name,
      reason: `Contacted ${formatRelativeDays(person.contacted_at || person.updated_at)}, no reply.`,
      domain: person.company_domain,
      logoUrl: null,
      href: `/contacts/${person.id}`,
      button: "Open",
    })),
    data.replies.map((person) => ({
      id: `reply-${person.id}`,
      title: person.name,
      reason: `Reply from ${person.company_domain}.`,
      domain: person.company_domain,
      logoUrl: null,
      href: `/contacts/${person.id}`,
      button: "Review",
    })),
    data.new_matches.map((company) => ({
      id: `match-${company.id}`,
      title: company.homepage_title || company.domain,
      reason: company.matched_role_title
        ? `New match for ${company.matched_role_title}.`
        : "New match from your latest scan.",
      domain: company.domain,
      logoUrl: company.logo_url ?? null,
      href: `/companies/${company.id}`,
      button: "Open",
    })),
    data.never_contacted.map((company) => ({
      id: `never-contacted-${company.id}`,
      title: company.homepage_title || company.domain,
      reason: "Researched with a contact, but no outreach yet.",
      domain: company.domain,
      logoUrl: company.logo_url ?? null,
      href: company.primary_contact_id
        ? `/contacts/${company.primary_contact_id}`
        : `/companies/${company.id}`,
      button: "Draft outreach",
    })),
  ];
  const firstOfEach = groups.flatMap((group) => group.slice(0, 1));
  const remainder = groups.flatMap((group) => group.slice(1));
  return [...firstOfEach, ...remainder].slice(0, VISIBLE_ACTIONS);
}

export function TodayPanel({
  data,
  loading,
  error,
  onRetry,
}: {
  data: OverviewActions | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const actions = data ? actionRows(data) : [];
  const cutoff = data
    ? new Date(Date.now() - data.follow_up_after_days * MILLISECONDS_PER_DAY).toISOString()
    : null;
  const links =
    data && cutoff
      ? [
          data.follow_up_companies_total > 0 && {
            label: "Company follow-ups",
            href: `/companies/pipeline?stage=contacted&updated_before=${encodeURIComponent(cutoff)}`,
          },
          data.follow_up_people_total > 0 && {
            label: "People follow-ups",
            href: `/contacts?stage=contacted&contacted_before=${encodeURIComponent(cutoff)}`,
          },
          data.replies_total > 0 && { label: "Replies", href: "/contacts?stage=replied" },
          data.new_matches_total > 0 && {
            label: "Matched companies",
            href: "/companies?stage=researched&source=job_match",
          },
          data.never_contacted_total > 0 && {
            label: "Ready for outreach",
            href: "/companies?stage=researched&has_contact=true",
          },
        ].filter((link): link is { label: string; href: string } => Boolean(link))
      : [];

  return (
    <section
      className="rounded-md border border-line bg-surface p-5 shadow-card sm:p-6"
      aria-busy={loading}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="utility-label text-signal-teal">Your next steps</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">Today</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Start with the work that moves your search forward.
          </p>
        </div>
        {loading && data ? <span className="text-xs text-text-secondary">Updating...</span> : null}
      </div>
      {error ? (
        <div
          role="alert"
          className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-rose"
        >
          <span>{error}</span>
          <Button variant="quiet" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
      {!data && loading ? (
        <div className="mt-5 space-y-3" role="status" aria-label="Loading next steps">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : data ? (
        <div className={loading ? "opacity-60" : ""}>
          {actions.length ? (
            <ul className="mt-5 divide-y divide-line">
              {actions.map((action) => (
                <li
                  key={action.id}
                  className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <CompanyLogo
                    logoUrl={action.logoUrl}
                    domain={action.domain}
                    className="h-10 w-10"
                  />
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="truncate text-sm font-semibold text-ink">{action.title}</p>
                    <p className="text-sm text-text-secondary">{action.reason}</p>
                  </div>
                  <Button href={action.href} variant="quiet" size="sm">
                    {action.button}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-text-secondary">
              You&apos;re caught up. Explore your pipeline or research another company.
            </p>
          )}
          {links.length ? (
            <nav
              aria-label="See all next steps"
              className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-signal-teal hover:underline"
                >
                  See all {link.label.toLowerCase()}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
