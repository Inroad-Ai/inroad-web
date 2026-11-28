import { APP_VERSION } from "@/lib/app-info";

export function DashboardFooter() {
  return (
    <footer className="px-page py-5 text-xs text-ink-faint">
      Inroad{APP_VERSION ? ` v${APP_VERSION}` : ""}
    </footer>
  );
}
