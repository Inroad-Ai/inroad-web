"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { useSignOut } from "@/hooks/useSignOut";
import { ResearchRunsProvider } from "@/lib/research-runs";

import { CommandPalette } from "./command-palette/CommandPalette";
import { useCommandPalette } from "./command-palette/useCommandPalette";
import { ThemeMenu } from "./ThemeMenu";
import { Av, Ic } from "./v2/kit";

interface NavEntry {
  icon: string;
  label: string;
  href: string;
  badge?: string;
  match: (path: string) => boolean;
}

const NAV: { group: string | null; items: NavEntry[] }[] = [
  {
    group: null,
    items: [
      { icon: "home", label: "Today", href: "/overview", match: (p) => p.startsWith("/overview") },
      {
        icon: "compass",
        label: "Discover",
        href: "/research",
        match: (p) => p.startsWith("/research"),
      },
      {
        icon: "radar",
        label: "Opportunities",
        href: "/opportunities",
        badge: "24",
        match: (p) => p.startsWith("/opportunities"),
      },
    ],
  },
  {
    group: "Pipeline",
    items: [
      {
        icon: "building",
        label: "Companies",
        href: "/companies",
        badge: "42",
        match: (p) => p.startsWith("/companies") && !p.startsWith("/companies/pipeline"),
      },
      {
        icon: "users",
        label: "People",
        href: "/contacts",
        badge: "86",
        match: (p) => p.startsWith("/contacts"),
      },
      {
        icon: "kanban",
        label: "Stages",
        href: "/companies/pipeline",
        match: (p) => p.startsWith("/companies/pipeline"),
      },
    ],
  },
  {
    group: "You",
    items: [
      { icon: "user", label: "Profile", href: "/profile", match: (p) => p.startsWith("/profile") },
      {
        icon: "spark",
        label: "Coach",
        href: "/coach",
        badge: "dot",
        match: (p) => p.startsWith("/coach"),
      },
    ],
  },
  {
    group: "Setup",
    items: [
      {
        icon: "plug",
        label: "Sources",
        href: "/integrations",
        match: (p) => p.startsWith("/integrations"),
      },
      {
        icon: "sliders",
        label: "Settings",
        href: "/settings",
        match: (p) => p.startsWith("/settings"),
      },
    ],
  },
];

function crumbFor(path: string): ReactNode {
  if (path.startsWith("/research/results")) {
    return (
      <>
        Discover / <b>Funded fintechs in the EU</b>
      </>
    );
  }
  if (path.startsWith("/companies/pipeline")) return <b>Stages</b>;
  if (/^\/companies\/.+/.test(path)) {
    return (
      <>
        Companies / <b>Ledgerline</b>
      </>
    );
  }
  if (/^\/contacts\/.+/.test(path)) {
    return (
      <>
        People / Priya Nair / <b>Outreach</b>
      </>
    );
  }
  if (path.startsWith("/profile/projects")) {
    return (
      <>
        Profile / <b>Projects</b>
      </>
    );
  }
  if (path.startsWith("/settings")) {
    return (
      <>
        Settings / <b>Notifications</b>
      </>
    );
  }
  const entry = NAV.flatMap((g) => g.items).find((item) => item.match(path));
  if (entry) return <b>{entry.label}</b>;
  if (path.startsWith("/notifications")) return <b>Notifications</b>;
  return null;
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const palette = useCommandPalette();
  const { signOut, signingOut } = useSignOut();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <ResearchRunsProvider>
      <div className="v2">
        <div className="shell">
          {navOpen ? (
            <button
              type="button"
              aria-label="Close menu"
              className="scrim"
              onClick={() => setNavOpen(false)}
            />
          ) : null}
          <aside className={`side ${navOpen ? "open" : ""}`} aria-label="Main">
            <Link href="/overview" className="brand">
              <i>i</i>inroad
            </Link>
            <button
              type="button"
              className="ni"
              style={{ marginBottom: 6, color: "rgb(var(--color-ink-faint))" }}
              onClick={() => {
                setNavOpen(false);
                palette.openPalette();
              }}
            >
              <Ic n="search" size="s" />
              Search
              <span className="kbd" style={{ marginLeft: "auto" }}>
                Ctrl K
              </span>
            </button>
            <nav>
              {NAV.map(({ group, items }) => (
                <div key={group ?? "top"}>
                  {group ? <div className="gl">{group}</div> : <div style={{ height: 6 }} />}
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`ni ${item.match(path) ? "on" : ""}`}
                      aria-current={item.match(path) ? "page" : undefined}
                      onClick={() => setNavOpen(false)}
                    >
                      <Ic n={item.icon} size="s" />
                      {item.label}
                      {item.badge === "dot" ? (
                        <span className="dotp" />
                      ) : item.badge ? (
                        <span className="n">{item.badge}</span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
            <div className="me">
              <Av i="JR" c={2} size="xs" />
              <Link href="/profile" className="sm m">
                Jordan Reyes
              </Link>
              <span className="sp" />
              <button
                type="button"
                className="xs faint"
                onClick={signOut}
                disabled={signingOut}
                style={{ cursor: "pointer" }}
              >
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </aside>

          <div className="main">
            <header className="top">
              <button
                type="button"
                className="iconb menu"
                aria-label="Open menu"
                onClick={() => setNavOpen(true)}
              >
                <Ic n="more" />
              </button>
              <div className="crumb">{crumbFor(path)}</div>
              <span className="sp" />
              <ThemeMenu />
              <Link href="/notifications" className="iconb" aria-label="Notifications, 3 new">
                <Ic n="bell" />
                <span className="bd">3</span>
              </Link>
            </header>
            <main className="content">{children}</main>
          </div>
        </div>
      </div>
      <CommandPalette open={palette.open} onClose={palette.closePalette} />
    </ResearchRunsProvider>
  );
}
