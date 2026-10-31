import type { Person } from "@/lib/types";

/** The people picked to contact about the role, first pick first. */
export function contactPicks(people: Person[]): Person[] {
  return people
    .filter((person) => person.contact_rank !== null)
    .sort((a, b) => (a.contact_rank ?? 0) - (b.contact_rank ?? 0));
}

/** A LinkedIn people search the user opens themselves. Nothing is fetched. */
export function linkedInSearchUrl(title: string, company: string): string {
  const keywords = encodeURIComponent(`${title} ${company}`);
  return `https://www.linkedin.com/search/results/people/?keywords=${keywords}`;
}

/** Where a pick was found, in plain words. */
export function contactSourceLabel(source: string | null): string {
  if (!source) return "the company's site";
  if (source.startsWith("job-posting")) return "the job posting";
  if (source.startsWith("hunter")) return "your Hunter key";
  if (source.startsWith("apollo")) return "your Apollo key";
  const enriched = source.includes("+hunter")
    ? ", email from your Hunter key"
    : source.includes("+apollo")
      ? ", email from your Apollo key"
      : "";
  return `the company's site${enriched}`;
}
