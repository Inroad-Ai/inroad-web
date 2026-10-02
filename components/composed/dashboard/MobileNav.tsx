"use client";

import Link from "next/link";

import { Drawer } from "@/components/ui/Drawer";
import { CloseIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";

import { DASHBOARD_HOME } from "./nav/nav.constants";
import { SidebarNav } from "./nav/SidebarNav";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} label="Main navigation">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-line px-3">
          <Link href={DASHBOARD_HOME} aria-label="Inroad" onClick={onClose}>
            <Logo variant="full" />
          </Link>
          <IconButton label="Close navigation" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <SidebarNav collapsed={false} onNavigate={onClose} />
        </nav>
      </div>
    </Drawer>
  );
}
