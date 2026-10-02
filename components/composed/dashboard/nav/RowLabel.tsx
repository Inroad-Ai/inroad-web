export function RowLabel({ collapsed, children }: { collapsed: boolean; children: string }) {
  if (collapsed) return null;
  return <span>{children}</span>;
}
