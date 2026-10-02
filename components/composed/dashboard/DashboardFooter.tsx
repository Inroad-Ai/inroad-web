import { APP_VERSION } from "@/lib/app-info";

export function DashboardFooter() {
  return (
    <footer className="border-t border-line px-4 py-4 text-xs text-text-secondary sm:px-6">
      Inroad{APP_VERSION ? ` v${APP_VERSION}` : ""}
    </footer>
  );
}
