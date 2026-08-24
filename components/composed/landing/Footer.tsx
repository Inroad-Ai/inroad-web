import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const LINK_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "What you get", href: "/#sources" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Get started", href: "/signup" },
      { label: "Log in", href: "/login" },
      { label: "Dashboard", href: "/research" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const SOCIALS = [
  {
    label: "X",
    href: "https://x.com",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0",
  },
  {
    label: "GitHub",
    href: "https://github.com",
    path: "M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57A12 12 0 0 0 12 .3",
  },
];

/**
 * Squares scattered across the watermark. Positions are percentages of the
 * watermark block, so they keep their arrangement at any width. Two tones:
 * solid amber reads as a "hit", the pale one as a candidate still being
 * checked — the same idea the hero animation uses.
 */
const WATERMARK_SQUARES = [
  { left: "20%", top: "58%", size: "h-2 w-2", tone: "bg-signal-amber-subtle" },
  { left: "24%", top: "80%", size: "h-3 w-3", tone: "bg-signal-amber" },
  { left: "28%", top: "78%", size: "h-2 w-2", tone: "bg-signal-amber-subtle" },
  { left: "30%", top: "36%", size: "h-2 w-2", tone: "bg-signal-amber" },
  { left: "33%", top: "79%", size: "h-2 w-2", tone: "bg-signal-amber-subtle" },
  { left: "36%", top: "24%", size: "h-3 w-3", tone: "bg-signal-amber" },
  { left: "39%", top: "26%", size: "h-3 w-3", tone: "bg-signal-amber" },
  { left: "42%", top: "48%", size: "h-3 w-3", tone: "bg-signal-amber" },
  { left: "47%", top: "23%", size: "h-3 w-3", tone: "bg-signal-amber" },
  { left: "50%", top: "79%", size: "h-2 w-2", tone: "bg-signal-amber-subtle" },
  { left: "54%", top: "77%", size: "h-3 w-3", tone: "bg-signal-amber" },
  { left: "57%", top: "51%", size: "h-3 w-3", tone: "bg-signal-amber-subtle" },
  { left: "62%", top: "60%", size: "h-2 w-2", tone: "bg-signal-amber-subtle" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label="Inroad home">
            <Logo />
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden font-sans text-sm text-text-secondary sm:block">
              Social media
            </span>
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-sm bg-surface-raised text-ink transition-colors hover:bg-signal-amber-subtle"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-dotted border-line" />

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex flex-col items-start gap-6">
            <p className="max-w-xs font-sans text-sm text-text-secondary">
              Skip the job board. Find companies that fit, research them properly, and send
              outreach that sounds like a real person did the homework.
            </p>
            <Button href="/signup" size="sm">
              Get started
            </Button>
          </div>

          {LINK_COLUMNS.map((column) => (
            <div key={column.heading}>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-signal-amber" />
                <span className="font-display text-base font-semibold text-ink">
                  {column.heading}
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-text-secondary transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Watermark. The negative bottom margin pulls the bottom bar up over the
          wordmark and lets the footer's overflow clip its descender, same as
          the letters running off the bottom edge in the reference. */}
      <div aria-hidden className="relative mt-12 select-none">
        <span className="-mb-8 block text-center font-display text-wordmark font-bold tracking-tight text-surface-raised sm:-mb-12 lg:-mb-16">
          Inroad
        </span>
        {WATERMARK_SQUARES.map((square) => (
          <span
            key={`${square.left}-${square.top}`}
            style={{ left: square.left, top: square.top }}
            className={`absolute ${square.size} ${square.tone}`}
          />
        ))}
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-2 px-6 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-sm text-text-secondary">
          © {new Date().getFullYear()} Inroad. Built for people who would rather do the homework
          than send another application.
        </p>
        <Link
          href="/terms"
          className="font-sans text-sm text-text-secondary transition-colors hover:text-ink"
        >
          Terms &amp; Conditions
        </Link>
      </div>
    </footer>
  );
}
