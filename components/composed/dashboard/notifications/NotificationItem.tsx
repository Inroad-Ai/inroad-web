"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { ExternalLinkIcon, SearchIcon } from "@/components/ui/Icons";
import { TextLink } from "@/components/ui/TextLink";
import type { Notification } from "@/lib/api-client/client";
import { formatDay, formatMonth, formatRelativeDays } from "@/lib/format";
import { safeHref } from "@/lib/safe-href";

const HN_PROVIDER = "hn_hiring";

const MAX_EVIDENCE_SHOWN = 4;

const EVIDENCE_LABELS: Record<string, string> = {
  hiring_announcement: "Hiring",
  funding: "Funding",
  expansion: "Expansion",
  product_launch: "Launch",
  layoff: "Layoffs",
  acquisition: "Acquisition",
  leadership_change: "Leadership",
  partnership: "Partnership",
};

const KIND_LABELS: Record<string, string> = {
  followed_company: "Saved company",
  hiring_fit: "Fits your roles",
};

export function NotificationItem({
  notification,
  onResearch,
  onOpen,
  onDismiss,
}: {
  notification: Notification;
  onResearch: () => void;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  const href = safeHref(notification.url);
  const isHackerNews = notification.provider === HN_PROVIDER;
  const detail =
    notification.excerpt && notification.excerpt !== notification.title
      ? notification.excerpt
      : null;
  // The alert's own post is its title; the rest is why the company is worth a look now.
  const evidence = (notification.evidence ?? [])
    .filter((item) => item.title !== notification.title)
    .slice(0, MAX_EVIDENCE_SHOWN);

  return (
    <li className="flex gap-4 border-t border-line py-5 first:border-0 first:pt-0">
      <CompanyLogo logoUrl={null} seed={notification.domain} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-sans-semibold text-ink">{notification.domain}</p>
          {notification.unread ? (
            <Badge tone="amber" dot>
              New
            </Badge>
          ) : null}
          <Badge tone={notification.kind === "followed_company" ? "amber" : "teal"}>
            {KIND_LABELS[notification.kind] ?? notification.kind}
          </Badge>
          {isHackerNews ? <Badge>Hacker News</Badge> : null}
          <span className="text-xs text-ink-muted">
            {notification.event_start
              ? formatMonth(notification.event_start)
              : formatRelativeDays(notification.created_at)}
          </span>
        </div>

        <p className="mt-2 break-words text-sm text-ink">{notification.title}</p>
        {detail ? (
          <p className="mt-1 line-clamp-2 break-words text-sm text-ink-muted">{detail}</p>
        ) : null}

        {notification.reasons.length > 0 ? (
          <ul aria-label="Why this was picked" className="mt-3 flex flex-wrap gap-2">
            {notification.reasons.map((reason) => (
              <li key={reason} className="rounded-full bg-ink/5 px-2.5 py-1 text-xs text-ink-muted">
                {reason}
              </li>
            ))}
          </ul>
        ) : null}
        {evidence.length > 0 ? (
          <div className="mt-3">
            <p className="text-xs font-sans-semibold text-ink-muted">Also from this company</p>
            <ul aria-label="Recent public evidence" className="mt-1.5 space-y-1">
              {evidence.map((item) => {
                const itemHref = safeHref(item.url);
                return (
                  <li key={`${item.url}-${item.happened_on}`} className="flex gap-2 text-sm">
                    <Badge>{EVIDENCE_LABELS[item.signal_type] ?? item.signal_type}</Badge>
                    <span className="min-w-0 flex-1 truncate text-ink">
                      {itemHref ? (
                        <TextLink href={itemHref} external>
                          {item.title}
                        </TextLink>
                      ) : (
                        item.title
                      )}
                    </span>
                    <span className="shrink-0 text-xs text-ink-muted">
                      {formatDay(item.happened_on)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        {isHackerNews ? (
          <p className="mt-2 text-xs text-ink-faint">
            Posted on Hacker News by someone at the company; not verified.
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" icon={<SearchIcon />} onClick={onResearch}>
            {notification.researched_at ? "Research again" : "Research company"}
          </Button>
          {href ? (
            <Button
              size="sm"
              variant="quiet"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              icon={<ExternalLinkIcon />}
              iconPosition="end"
              onClick={onOpen}
            >
              Open post
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            Not interested
          </Button>
        </div>
        {notification.researched_at ? (
          <p className="mt-3 text-xs text-ink-muted" role="status">
            Research requested. Follow it on <TextLink href="/research">Research</TextLink>; the
            brief lands in Companies.
          </p>
        ) : null}
      </div>
    </li>
  );
}
