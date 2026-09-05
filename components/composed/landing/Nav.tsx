"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";

export function Nav() {
  const [signedIn, setSignedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const updateScrolledState = () => setScrolled(window.scrollY > 12);
    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  return (
    <motion.nav
      className={`sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur ${scrolled ? "shadow-card" : ""}`}
      initial={reduceMotion ? false : { y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.48, ease: LANDING_EASE }}
    >
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[padding] duration-200 ${scrolled ? "py-3.5" : "py-5"}`}>
        <Link href="/" aria-label="Inroad home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          <a
            href="#sources"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-ink"
          >
            What you get
          </a>
          <a
            href="#how-it-works"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-ink"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-ink"
          >
            FAQ
          </a>
        </div>

        <motion.div whileHover={reduceMotion ? undefined : { y: -1 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
          {signedIn ? (
            <Button href="/research" size="sm">
              Dashboard
            </Button>
          ) : (
            <Button href="/signup" size="sm">
              Get started
            </Button>
          )}
        </motion.div>
      </div>
    </motion.nav>
  );
}
