import { Button } from "@/components/ui/Button";
import { SECTION_IDS } from "@/lib/landing/sections";

/** Chapter six's way out of the story. */
export function StoryCtas() {
  return (
    <div className="mt-7 flex flex-wrap gap-2.5">
      <Button href="/signup" size="lg">
        Write your first one
      </Button>
      <Button href={`#${SECTION_IDS.pricing}`} variant="quiet" size="lg">
        See pricing
      </Button>
    </div>
  );
}
