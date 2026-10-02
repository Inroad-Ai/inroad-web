export interface NavLink {
  href: string;
  label: string;
  icon: () => JSX.Element;
}

export interface NavGroup {
  label: string;
  icon: () => JSX.Element;
  items: NavLink[];
}

export type NavEntry = NavLink | NavGroup;
