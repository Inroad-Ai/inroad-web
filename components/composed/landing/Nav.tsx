"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { ThemeControl } from "@/components/composed/ThemeControl";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";
import { NAV_LINKS, SECTION_IDS } from "@/lib/landing/sections";

import { MobileMenu } from "./MobileMenu";

const MENU_ID = "landing-mobile-menu";

export function Nav() {
  const [signedIn, setSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useLandingMotion();

  // A native token is what middleware.ts actually admits to /research, so
  // that's the same thing this link should be asking about.
  useEffect(() => {
    let cancelled = false;
    ensureValidAccessToken()
      .then((token) => {
        if (!cancelled) setSignedIn(token !== null);
      })
      .catch(() => {
        // Nav falls back to "Get started"; the route guards own session state.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-3 z-40 px-3"
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: LANDING_EASE }}
    >
      <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-2 rounded-full bg-surface pl-4 pr-2 shadow-card">
        <a href={`#${SECTION_IDS.top}`} aria-label="Inroad home" className="rounded-full">
          <Logo />
        </a>
        <nav aria-label="Sections" className="ml-4 hidden gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="rounded-full px-3 py-2 text-sm font-sans-semibold text-ink-muted transition-colors duration-fast hover:bg-ink/5 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeControl compact />
          </div>
          {signedIn ? (
            <Button href="/research" size="sm">
              Dashboard
            </Button>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Log in
              </Button>
              <Button href="/signup" size="sm">
                Get started
              </Button>
            </>
          )}
          <IconButton
            label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            onClick={() => setMenuOpen((open) => !open)}
            className="lg:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>
        <MobileMenu
          id={MENU_ID}
          open={menuOpen}
          signedIn={signedIn}
          onClose={() => setMenuOpen(false)}
        />
      </div>
    </motion.header>
  );
}
