import Link from "next/link";

interface StatTileProps {
  label: string;
  value: number | string;
  context: string;
  href?: string;
}

export function StatTile({ label, value, context, href }: StatTileProps) {
  const content = (
    <>
      <span className="utility-label text-text-secondary">{label}</span>
      <strong className="mt-2 block font-display text-3xl font-semibold text-ink">{value}</strong>
      <span className="mt-1 block text-sm text-text-secondary">{context}</span>
    </>
  );
  const className = "block rounded-md border border-line bg-surface p-5 shadow-card sm:p-6";

  return href ? (
    <Link href={href} className={`${className} hover:border-signal-teal`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
