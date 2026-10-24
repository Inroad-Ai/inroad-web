import type { CompanySort } from "@/lib/types";
import { GridIcon, ListIcon, SearchIcon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { PIPELINE_STAGES, STAGE_LABEL, type PipelineStage } from "@/components/ui/StatusBadge";
import { Tabs, type TabItem } from "@/components/ui/Tabs";

export type CompaniesView = "table" | "cards";

const SORT_OPTIONS: { value: CompanySort; label: string }[] = [
  { value: "updated_desc", label: "Last researched (newest)" },
  { value: "updated_asc", label: "Last researched (oldest)" },
  { value: "created_desc", label: "Date saved (newest)" },
  { value: "created_asc", label: "Date saved (oldest)" },
  { value: "domain_asc", label: "Domain (A-Z)" },
  { value: "domain_desc", label: "Domain (Z-A)" },
];

const VIEW_TABS: TabItem[] = [
  { id: "table", label: "Table", icon: ListIcon },
  { id: "cards", label: "Cards", icon: GridIcon },
];

const STAGE_FILTERS: { value: PipelineStage | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...PIPELINE_STAGES.map((stage) => ({ value: stage, label: STAGE_LABEL[stage] })),
];

export function CompaniesToolbar({
  searchInput,
  onSearchInput,
  stage,
  onStage,
  sort,
  onSort,
  view,
  onView,
}: {
  searchInput: string;
  onSearchInput: (value: string) => void;
  stage: PipelineStage | "all";
  onStage: (stage: PipelineStage | "all") => void;
  sort: CompanySort;
  onSort: (sort: CompanySort) => void;
  view: CompaniesView;
  onView: (view: CompaniesView) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:max-w-sm sm:flex-1">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-muted"
          >
            <SearchIcon />
          </span>
          <Input
            type="search"
            value={searchInput}
            onChange={(e) => onSearchInput(e.target.value)}
            placeholder="Search by domain..."
            className="pl-11"
            aria-label="Search companies by domain"
          />
        </div>

        <Select
          value={sort}
          onChange={(e) => onSort(e.target.value as CompanySort)}
          aria-label="Sort companies"
          className="w-full sm:ml-auto sm:w-auto"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <div role="group" aria-label="Layout">
          <Tabs items={VIEW_TABS} activeId={view} onChange={(id) => onView(id as CompaniesView)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by stage">
        {STAGE_FILTERS.map((filter) => (
          <div key={filter.value}>
            <SelectableCard
              compact
              selected={stage === filter.value}
              onClick={() => onStage(filter.value)}
            >
              {filter.label}
            </SelectableCard>
          </div>
        ))}
      </div>
    </div>
  );
}
