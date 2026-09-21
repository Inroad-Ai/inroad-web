"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useLandingMotion } from "@/lib/landing-motion";

const LINKS = [
  { label: "What you get", href: "/#sources" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Sample dossier", href: "/#sample" },
  { label: "Questions", href: "/#faq" },
] as const;

export function Footer() {
  const reduceMotion = useLandingMotion();

  return (
    <footer className="bg-ink text-paper">
      <Reveal className="mx-auto max-w-6xl px-6 py-14 sm:py-20" offset={24} duration={0.62}>
        <div className="grid gap-12 border-b border-paper/15 pb-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end">
          <div>
            <p className="utility-label text-signal-amber">Take the direct route</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-[-0.05em] text-paper sm:text-5xl">
              Do the homework once. Make it count.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper/65 sm:text-base">
              Drop in a company, get the research that makes a message worth sending, then send it
              yourself.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <Button href="/signup" className="min-w-36">
                Get started
              </Button>
            </motion.div>
            <p className="mt-3 text-xs text-paper/55">Free during early access.</p>
          </div>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-start">
          <div>
            <Link href="/" aria-label="Inroad home">
              <Logo className="[&>span]:text-paper" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/60">
              A research workspace for people who would rather make a real connection than send
              another application into a queue.
            </p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-6 gap-y-4 sm:justify-self-end"
          >
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-paper/70 transition-colors hover:text-signal-amber"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-sm text-paper/70 transition-colors hover:text-signal-amber"
            >
              Log in
            </Link>
            <Link
              href="/research"
              className="text-sm text-paper/70 transition-colors hover:text-signal-amber"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Inroad. Built with care for careful job seekers.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-paper">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-paper">
              Terms
            </Link>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
