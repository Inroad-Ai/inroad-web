import type { DemoSource } from "./ask-types";

export const source = (label: string, quote: string, url: string): DemoSource => ({
  label,
  quote,
  url,
});
