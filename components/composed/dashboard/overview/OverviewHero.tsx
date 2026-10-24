import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRightIcon, SearchIcon } from "@/components/ui/Icons";
import { plural } from "@/lib/format";

export function OverviewHero({ active }: { active: number }) {
  return (
    <Card as="section" padding="none" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 bg-glow-amber blur-2xl"
      />
      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Eyebrow dot="live">Search momentum</Eyebrow>
          <h2 className="mt-4 font-display text-2xl font-sans-semibold leading-display tracking-display text-ink sm:text-3xl">
            {active
              ? `${plural(active, "company is", "companies are")} active in your pipeline`
              : "Turn research into conversations"}
          </h2>
          <p className="mt-3 text-sm text-ink-muted sm:text-base">
            The companies you&apos;ve found, the outreach you&apos;ve started, and the replies
            moving your search forward.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/research" icon={<SearchIcon />}>
            Research a company
          </Button>
          <Button
            href="/companies/pipeline"
            variant="quiet"
            icon={<ArrowRightIcon />}
            iconPosition="end"
          >
            View pipeline
          </Button>
        </div>
      </div>
    </Card>
  );
}
