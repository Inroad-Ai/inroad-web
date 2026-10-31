import type { CompanyDetail } from "@/lib/types";

import { DashboardPanel } from "../DashboardPanel";
import { NewsSummary } from "./NewsSummary";
import { SignalsList } from "./SignalsList";

/** Dated news about the company. Nothing renders when there is none. */
export function NewsSection({ detail }: { detail: CompanyDetail }) {
  const research = detail.latest_research;
  if (research === null) return null;
  const signals = research.signals ?? [];
  const legacyNews = research.research_backend !== "sourcing" && research.news?.items.length;
  if (signals.length === 0 && !legacyNews) return null;

  return (
    <DashboardPanel title="News">
      {signals.length > 0 ? (
        <SignalsList signals={signals} companyNewsCollected />
      ) : (
        <NewsSummary news={research.news} />
      )}
    </DashboardPanel>
  );
}
