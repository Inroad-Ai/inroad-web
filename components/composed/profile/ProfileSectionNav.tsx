export interface ProfileNavItem {
  id: string;
  label: string;
}

/** Desktop only: on narrow screens the sections simply stack. */
export function ProfileSectionNav({ items }: { items: readonly ProfileNavItem[] }) {
  return (
    <nav aria-label="Profile sections" className="hidden w-52 shrink-0 lg:block">
      <ul className="sticky top-24 space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block rounded-nest px-3 py-2.5 text-sm font-sans-semibold text-ink-muted transition-colors duration-fast hover:bg-ink/5 hover:text-ink"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
