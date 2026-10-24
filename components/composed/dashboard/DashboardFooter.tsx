import { APP_VERSION } from "@/lib/app-info";

export function DashboardFooter() {
  return (
    <footer className="utility-label border-t border-line px-page py-5 text-ink-faint">
      Inroad{APP_VERSION ? ` v${APP_VERSION}` : ""}
    </footer>
  );
}
