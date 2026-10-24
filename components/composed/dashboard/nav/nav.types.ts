import type { IconComponent } from "@/components/ui/Icons";

export interface NavLink {
  href: string;
  label: string;
  icon: IconComponent;
}

export interface NavSection {
  label: string;
  items: NavLink[];
}
