import { ResultCard } from "@/components/composed/dashboard/ResultCard";
import { totalTimeSeconds } from "@/lib/format";
import { SOURCE_KEYS, type CompanyDossier } from "@/lib/types";

/**
 * A recorded run, not invented marketing data, and rendered with the same
 * ResultCard the dashboard uses. If the card changes, this changes with it —
 * which is the point of not drawing a picture of it instead.
 */
const SAMPLE: CompanyDossier = {
  domain: "stripe.com",
  homepage: {
    url: "https://stripe.com",
    final_url: "https://stripe.com/",
    status_code: 200,
    title: "Stripe | Financial Infrastructure to Grow Your Revenue",
    description:
      "Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes.",
    headings: [
      "Financial infrastructure to grow your revenue",
      "Modular solutions",
      "Global scale",
      "Designed for developers",
    ],
    word_count: 1284,
    body_text: null,
    linkedin_url: null,
    logo_url: null,
    detected_technologies: [],
  },
  news: {
    query: "stripe.com",
    count: 6,
    items: [
      {
        title: "Stripe expands stablecoin payments to more markets",
        link: "https://example.com/stripe-stablecoin",
        source: "Reuters",
        published: "Tue, 05 Aug 2026 09:12:00 GMT",
      },
      {
        title: "Payments firm reports record annual volume",
        link: "https://example.com/stripe-volume",
        source: "Financial Times",
        published: "Mon, 04 Aug 2026 17:40:00 GMT",
      },
      {
        title: "Inside the engineering behind a global payments network",
        link: "https://example.com/stripe-engineering",
        source: "The Verge",
        published: "Sun, 03 Aug 2026 11:05:00 GMT",
      },
    ],
  },
  hiring: {
    is_hiring: true,
    open_roles: 548,
    source: "greenhouse",
    careers_url: "https://stripe.com/jobs/search",
    sample_roles: [
      "Staff Engineer, Payments Infrastructure",
      "Account Executive, Mid-Market",
      "Technical Writer, Developer Docs",
    ],
    additional_sources: [],
  },
  linkedin: null,
  profile: null,
  errors: {},
  partial: false,
  from_cache: false,
  elapsed_ms: 1615,
};

export function SampleDossier() {
  return (
    <section id="sample" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="utility-label text-text-secondary">
            One run, exactly as it comes back
          </p>
          <p className="font-sans text-sm text-text-secondary">
            {SAMPLE.domain} · {totalTimeSeconds(SAMPLE.elapsed_ms)}s
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SOURCE_KEYS.map((key) => (
            <ResultCard
              key={key}
              source={key}
              state="done"
              dossier={SAMPLE}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
