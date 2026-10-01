import { ExternalLinkIcon } from "@/components/ui/Icons";
import { APP_VERSION, DOCS_URL } from "@/lib/app-info";

export function DashboardFooter() {
  return (
    <footer className="flex items-center justify-between gap-4 border-t border-line px-4 py-4 text-xs text-text-secondary sm:px-6">
      <span>Inroad{APP_VERSION ? ` v${APP_VERSION}` : ""}</span>
      {DOCS_URL ? (
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-signal-teal"
        >
          Help and docs
          <ExternalLinkIcon />
        </a>
      ) : null}
    </footer>
  );
}
