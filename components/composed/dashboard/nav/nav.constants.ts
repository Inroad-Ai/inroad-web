import {
  BoardIcon,
  BuildingIcon,
  GridIcon,
  PlugIcon,
  SearchIcon,
  SlidersIcon,
  UserIcon,
} from "@/components/ui/Icons";

import type { NavEntry } from "./nav.types";

export const DASHBOARD_HOME = "/overview";

export const NAV: NavEntry[] = [
  { href: DASHBOARD_HOME, label: "Overview", icon: GridIcon },
  { href: "/research", label: "Research", icon: SearchIcon },
  { href: "/companies", label: "Companies", icon: BuildingIcon },
  {
    label: "Pipeline",
    icon: BoardIcon,
    // Labelled distinctly from the top-level "Companies" link above -
    // that's the plain list, these are the two stage boards.
    items: [
      { href: "/companies/pipeline", label: "Stages", icon: BuildingIcon },
      { href: "/contacts", label: "People", icon: UserIcon },
    ],
  },
  { href: "/integrations", label: "Integrations", icon: PlugIcon },
  { href: "/settings", label: "Settings", icon: SlidersIcon },
];

export const PAGE_TITLES: Record<string, string> = {
  "/overview": "Overview",
  "/profile": "Profile",
  "/research": "Research",
  "/companies/pipeline": "Pipeline",
  "/companies": "Companies",
  "/contacts": "People",
  "/settings": "Settings",
};
