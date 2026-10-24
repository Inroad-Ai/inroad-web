"use client";

import Link from "next/link";

import { Drawer } from "@/components/ui/Drawer";
import { CloseIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import type { Profile } from "@/lib/api-client/client";

import { DASHBOARD_HOME } from "./nav/nav.constants";
import { SidebarNav } from "./nav/SidebarNav";
import { SidebarProfileCard } from "./shell/SidebarProfileCard";

export function MobileNav({
  open,
  onClose,
  profile,
  profileLoading,
}: {
  open: boolean;
  onClose: () => void;
  profile: Profile | null;
  profileLoading: boolean;
}) {
  return (
    <Drawer open={open} onClose={onClose} label="Main navigation">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 pb-4 pt-5">
          <Link href={DASHBOARD_HOME} aria-label="Inroad, overview" onClick={onClose}>
            <Logo variant="full" />
          </Link>
          <IconButton label="Close navigation" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pb-4">
          <SidebarNav collapsed={false} onNavigate={onClose} />
        </nav>
        <div className="px-3 pb-4">
          <SidebarProfileCard
            profile={profile}
            loading={profileLoading}
            collapsed={false}
            onNavigate={onClose}
          />
        </div>
      </div>
    </Drawer>
  );
}
