/**
 * Structure only: a persistent sidebar slot next to the page content. `hidden`
 * keeps it out of the flow (and the visual output identical to before this
 * layout existed) until a real nav is built here.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside
        aria-hidden="true"
        data-slot="dashboard-sidebar"
        className="hidden"
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
