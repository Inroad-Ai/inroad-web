import { DataField } from "@/components/ui/DataField";
import { CheckCircleIcon, SpinnerIcon, XCircleIcon } from "@/components/ui/Icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusDot } from "@/components/ui/StatusDot";
import type { CardState, CompanyDossier, SourceKey } from "@/lib/types";

const SOURCES: Record<SourceKey, { code: string; name: string }> = {
  homepage: { code: "SOURCE_01", name: "Homepage" },
  news: { code: "SOURCE_02", name: "News" },
  hiring: { code: "SOURCE_03", name: "Hiring signal" },
};

/** What the person actually lost when a source came back empty. */
const NOTHING_FOUND: Record<SourceKey, string> = {
  homepage: "The site did not answer.",
  news: "No recent coverage found.",
  hiring: "No hiring page found.",
};

const PROGRESS_TONE: Record<CardState, string> = {
  idle: "text-text-secondary",
  pending: "text-signal-teal",
  done: "text-success",
  failed: "text-error",
};

interface ResultCardProps {
  source: SourceKey;
  state: CardState;
  dossier?: CompanyDossier | null;
  progress?: boolean;
}

export function ResultCard({ source, state, dossier = null, progress = false }: ResultCardProps) {
  const { code, name } = SOURCES[source];
  const reason = dossier?.errors?.[source];

  return (
    <article
      // Keep neighboring cards aligned when one source has less to show.
      className={`flex flex-col rounded-md border border-line bg-surface shadow-card transition-colors hover:border-signal-teal/40 ${progress ? "min-h-40 p-4" : "min-h-72 p-6"}`}
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-line pb-4">
        <span className="utility-label text-text-secondary">{code}</span>
        <span className="font-display text-base font-medium text-ink">{name}</span>
      </header>

      <div className="flex flex-1 flex-col pt-5">
        {state === "pending" ? <Checking /> : null}
        {state === "idle" ? <Waiting progress={progress} /> : null}
        {state === "failed" ? (
          <Nothing source={source} reason={reason} progress={progress} />
        ) : null}
        {state === "done" ? <Found source={source} dossier={dossier} /> : null}
      </div>

      <footer className="flex items-center gap-2 pt-4">
        {progress ? <ProgressStatusIcon state={state} /> : <StatusDot state={state} />}
        <span
          className={`utility-label ${progress ? PROGRESS_TONE[state] : "text-text-secondary"}`}
        >
          {footerLabel(state, progress)}
        </span>
      </footer>
    </article>
  );
}

function ProgressStatusIcon({ state }: { state: CardState }) {
  if (state === "pending") {
    return (
      <span className="text-signal-teal">
        <SpinnerIcon />
      </span>
    );
  }
  if (state === "done") {
    return (
      <span className="text-success">
        <CheckCircleIcon />
      </span>
    );
  }
  if (state === "failed") {
    return (
      <span className="text-error">
        <XCircleIcon />
      </span>
    );
  }
  return <StatusDot state="idle" />;
}

function footerLabel(state: CardState, progress: boolean): string {
  if (state === "pending") return "Still checking";
  if (state === "done") return progress ? "Checked" : "Found";
  if (state === "failed") return progress ? "Check failed" : "Nothing found";
  return "Not started";
}

function Waiting({ progress }: { progress: boolean }) {
  return (
    <p className="text-sm text-text-secondary/70">
      {progress ? "Waiting to check." : "Enter a domain to check this."}
    </p>
  );
}

function Checking() {
  return (
    <div className="space-y-2.5" aria-hidden="true">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

function Nothing({
  source,
  reason,
  progress,
}: {
  source: SourceKey;
  reason?: string;
  progress: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-rose">
        {progress ? "This check failed." : NOTHING_FOUND[source]}
      </p>
      {reason ? (
        // The backend's own words, kept as secondary detail rather than as the
        // headline — it is written for whoever debugs this, not for the reader.
        <p className="utility-label text-text-secondary/60">{reason}</p>
      ) : null}
    </div>
  );
}

function Found({ source, dossier }: { source: SourceKey; dossier: CompanyDossier | null }) {
  if (!dossier) return <p className="text-sm text-text-secondary">Source checked.</p>;
  if (source === "homepage") return <Homepage dossier={dossier} />;
  if (source === "news") return <News dossier={dossier} />;
  return <Hiring dossier={dossier} />;
}

function Homepage({ dossier }: { dossier: CompanyDossier }) {
  const homepage = dossier.homepage;
  if (!homepage) return null;

  return (
    <div className="flex flex-1 flex-col gap-3">
      <p className="font-sans text-base leading-snug text-ink">
        {homepage.title ?? "This page has no title."}
      </p>
      {homepage.description ? (
        <p className="line-clamp-4 text-sm leading-relaxed text-text-secondary">
          {homepage.description}
        </p>
      ) : (
        <p className="text-sm text-text-secondary">No description on the page.</p>
      )}
      <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-1 pt-2">
        <DataField label="Words">{homepage.word_count.toLocaleString()}</DataField>
        <DataField label="Headings">{homepage.headings.length}</DataField>
      </dl>
    </div>
  );
}

function News({ dossier }: { dossier: CompanyDossier }) {
  const news = dossier.news;
  if (!news) return null;

  if (news.items.length === 0) {
    return (
      <p className="text-sm text-text-secondary">Nothing published about this company recently.</p>
    );
  }

  return (
    <ul className="flex flex-1 flex-col gap-3">
      {news.items.slice(0, 3).map((item, index) => (
        <li key={`${item.link ?? item.title}-${index}`}>
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm leading-snug text-ink underline decoration-line underline-offset-4 hover:decoration-signal-teal"
            >
              {item.title}
            </a>
          ) : (
            <span className="text-sm leading-snug text-ink">{item.title}</span>
          )}
          {item.source ? (
            <span className="utility-label mt-1 block text-text-secondary/70">{item.source}</span>
          ) : null}
        </li>
      ))}
      {news.count > 3 ? (
        <li className="utility-label mt-auto pt-1 text-text-secondary/70">
          {news.count - 3} more headline{news.count - 3 === 1 ? "" : "s"}
        </li>
      ) : null}
    </ul>
  );
}

function Hiring({ dossier }: { dossier: CompanyDossier }) {
  const hiring = dossier.hiring;
  if (!hiring) return null;

  if (!hiring.is_hiring) {
    return (
      <p className="text-sm text-text-secondary">
        Their careers page lists no open roles right now.
      </p>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <p className="font-sans text-base text-ink">
        {/* null and 0 mean different things upstream, so they read differently here. */}
        {hiring.open_roles === null
          ? "Hiring, roles not counted"
          : `${hiring.open_roles} open role${hiring.open_roles === 1 ? "" : "s"}`}
      </p>
      {hiring.sample_roles.length > 0 ? (
        <ul className="space-y-1.5">
          {hiring.sample_roles.slice(0, 3).map((role) => (
            <li key={role} className="text-sm leading-snug text-text-secondary">
              {role}
            </li>
          ))}
        </ul>
      ) : null}
      <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-1 pt-2">
        <DataField label="Board">{hiring.source ?? "unknown"}</DataField>
        {hiring.careers_url ? (
          <DataField label="Careers">
            <a
              href={hiring.careers_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal-teal underline decoration-signal-teal/30 underline-offset-4"
            >
              Open
            </a>
          </DataField>
        ) : null}
      </dl>
    </div>
  );
}
