"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { ExternalLinkIcon, SearchIcon } from "@/components/ui/Icons";
import { TextLink } from "@/components/ui/TextLink";
import type { Notification } from "@/lib/api-client/client";
import { formatMonth, formatRelativeDays } from "@/lib/format";
import { safeHref } from "@/lib/safe-href";

const HN_PROVIDER = "hn_hiring";

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
