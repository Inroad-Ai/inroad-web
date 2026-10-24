"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { ThemeControl } from "@/components/composed/ThemeControl";
import { Button } from "@/components/ui/Button";
import { LANDING_EASE, useLandingMotion } from "@/lib/landing-motion";
import { NAV_LINKS } from "@/lib/landing/sections";

/** The section links, theme and account actions below the large-screen breakpoint. */
export function MobileMenu({
  id,
  open,
  signedIn,
  onClose,
}: {
  id: string;
  open: boolean;
  signedIn: boolean;
  onClose: () => void;
}) {
  const reduceMotion = useLandingMotion();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id={id}
          className="absolute inset-x-0 top-full mt-2 rounded-card bg-surface p-3 shadow-pop lg:hidden"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.24, ease: LANDING_EASE }}
        >
          <nav aria-label="Sections" className="grid">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={onClose}
                className="rounded-nest px-3 py-3 text-base font-sans-semibold text-ink transition-colors duration-fast hover:bg-ink/5"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line px-1 pt-3">
            <ThemeControl />
            {signedIn ? null : (
              <Button href="/login" variant="quiet" size="sm">
                Log in
              </Button>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
