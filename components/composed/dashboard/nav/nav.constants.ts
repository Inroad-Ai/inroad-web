import {
  BoardIcon,
  BuildingIcon,
  GridIcon,
  PlugIcon,
  SearchIcon,
  SlidersIcon,
  UserIcon,
} from "@/components/ui/Icons";

import type { NavSection } from "./nav.types";

export const DASHBOARD_HOME = "/overview";

export const PROFILE_HREF = "/profile";

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { href: DASHBOARD_HOME, label: "Overview", icon: GridIcon },
      { href: "/research", label: "Research", icon: SearchIcon },
      { href: "/companies", label: "Companies", icon: BuildingIcon },
    ],
  },
  {
    // "Stages", not "Pipeline": the section heading already says Pipeline,
    // and the plain Companies list sits right above it.
    label: "Pipeline",
    items: [
      { href: "/companies/pipeline", label: "Stages", icon: BoardIcon },
      { href: "/contacts", label: "People", icon: UserIcon },
    ],
  },
  {
    label: "Account",
    items: [
      { href: PROFILE_HREF, label: "Profile", icon: UserIcon },
      { href: "/integrations", label: "Integrations", icon: PlugIcon },
      { href: "/settings", label: "Settings", icon: SlidersIcon },
    ],
  },
];

export const PAGE_TITLES: Record<string, string> = {
  "/overview": "Overview",
  "/profile": "Profile",
  "/research": "Research",
  "/companies/pipeline": "Pipeline",
  "/companies": "Companies",
  "/contacts": "People",
  "/integrations": "Integrations",
  "/settings": "Settings",
  "/notifications": "Notifications",
};
