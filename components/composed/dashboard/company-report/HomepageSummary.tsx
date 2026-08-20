import type { HomepageResult } from "@/lib/types";
import { DataField } from "@/components/ui/DataField";
import { EmptyState } from "@/components/ui/EmptyState";

export function HomepageSummary({ homepage }: { homepage: HomepageResult | null }) {
  return (
    <div>
      <p className="utility-label text-text-secondary/70">Homepage</p>
      {homepage === null ? (
        <EmptyState className="mt-2">The site did not answer on the last run.</EmptyState>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {homepage.description ?? "No description on the page."}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <DataField label="Words">{homepage.word_count.toLocaleString()}</DataField>
            <DataField label="Headings">{homepage.headings.length}</DataField>
          </dl>
          {homepage.headings.length > 0 ? (
            <ul className="mt-4 space-y-1.5">
              {homepage.headings.map((heading, index) => (
                <li key={`${heading}-${index}`} className="text-sm text-ink">
                  {heading}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </div>
  );
}
