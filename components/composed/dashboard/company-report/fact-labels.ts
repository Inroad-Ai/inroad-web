import type { SourcedFact } from "@/lib/types";

export function factText(fact: SourcedFact): string {
  const { text, name, description } = fact.value as Record<string, unknown>;
  if (typeof text === "string") return text;
  if (typeof name === "string") {
    return typeof description === "string" ? `${name}: ${description}` : name;
  }
  return JSON.stringify(fact.value);
}

/** "funding_round" -> "funding round". */
export function humanize(snakeCase: string): string {
  return snakeCase.replaceAll("_", " ");
}
