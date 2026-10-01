/** Label only renders past the `lg` breakpoint when not collapsed - below
 * `lg` the rail is always icon-only regardless of the stored preference,
 * same reasoning as the `.sidebar-desktop .sidebar-row` override in
 * globals.css. Both branches are full literal strings on purpose: Tailwind
 * scans source text for class names, so a dynamically-glued "lg:" prefix
 * would never make it into the generated CSS. */
export function RowLabel({ collapsed, children }: { collapsed: boolean; children: string }) {
  if (collapsed) return null;
  return <span className="hidden lg:inline">{children}</span>;
}
