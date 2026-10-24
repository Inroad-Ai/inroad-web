import { Button } from "@/components/ui/Button";

import { PageNotice } from "../PageNotice";

/** No rows, a failed load, or a filter that matched nothing. */
export function CompaniesEmpty({
  kind,
  errorMessage,
  onClearFilters,
}: {
  kind: "error" | "filtered" | "none";
  errorMessage?: string;
  onClearFilters: () => void;
}) {
  if (kind === "error") return <PageNotice isError>{errorMessage}</PageNotice>;

  if (kind === "filtered") {
    return (
      <PageNotice
        title="No companies match that"
        action={
          <Button variant="quiet" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        }
      >
        No companies match this search and filter combination.
      </PageNotice>
    );
  }

  return (
    <PageNotice
      title="Nothing here yet"
      action={
        <Button href="/research" size="sm">
          Research a company
        </Button>
      }
    >
      Companies show up here once you research them.
    </PageNotice>
  );
}
