import Link from "next/link";

import { Logo } from "@/components/ui/Logo";
import { SECTION_IDS } from "@/lib/landing/sections";

const PRODUCT_LINKS = [
  { label: "The story", id: SECTION_IDS.story },
  { label: "Features", id: SECTION_IDS.features },
  { label: "Pricing", id: SECTION_IDS.pricing },
  { label: "FAQ", id: SECTION_IDS.faq },
] as const;

const ACCOUNT_LINKS = [
  { label: "Create account", href: "/signup" },
  { label: "Log in", href: "/login" },
] as const;

const LINK_CLASS =
  "text-sm font-sans-semibold text-ink-muted transition-colors duration-fast hover:text-ink";

export function Footer() {
  return (
    <footer className="border-t border-line pb-9 pt-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-footer">
        <div className="sm:col-span-2 lg:col-span-1">
          <a
            href={`/#${SECTION_IDS.top}`}
            aria-label="Inroad home"
            className="inline-block rounded-full"
          >
            <Logo />
          </a>
          <p className="mt-4 max-w-xs text-ink-muted">
            Get an inroad, not a rejection email. A research and outreach copilot for the
            candidate&apos;s side of hiring.
          </p>
        </div>
        <nav aria-label="Product">
          <h2 className="utility-label mb-3.5 text-ink-muted">Product</h2>
          <ul className="grid gap-2.5">
            {PRODUCT_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`/#${link.id}`} className={LINK_CLASS}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Get going">
          <h2 className="utility-label mb-3.5 text-ink-muted">Get going</h2>
          <ul className="grid gap-2.5">
            {ACCOUNT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-3 px-4 text-sm font-sans-semibold text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Inroad. Free during early access.</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="transition-colors duration-fast hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors duration-fast hover:text-ink">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
