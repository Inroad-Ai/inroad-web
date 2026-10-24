import { Button } from "@/components/ui/Button";
import { SearchIcon } from "@/components/ui/Icons";

import { PageNotice } from "../PageNotice";

export function OverviewEmpty() {
  return (
    <PageNotice
      title="Your dashboard is ready when you are"
      action={
        <Button href="/research" size="sm" icon={<SearchIcon />}>
          Research a company
        </Button>
      }
    >
      Research and save a company to start tracking your search here.
    </PageNotice>
  );
}
