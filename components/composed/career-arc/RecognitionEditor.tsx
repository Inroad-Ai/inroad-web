"use client";

import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { CareerArcRecognition } from "@/lib/api-client/client";
import { CAREER_ARC_LIMITS, RECOGNITION_KINDS, newRecognition } from "@/lib/career-arc";

type TextKey = "title" | "issuer" | "year" | "link";

export function RecognitionEditor({
  items,
  onChange,
}: {
  items: CareerArcRecognition[];
  onChange: (next: CareerArcRecognition[]) => void;
}) {
  function replace(next: CareerArcRecognition) {
    onChange(items.map((item) => (item.id === next.id ? next : item)));
  }

  function setText(item: CareerArcRecognition, key: TextKey, value: string) {
    replace({ ...item, [key]: key === "title" ? value : value || null });
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="grid gap-3 rounded-nest bg-surface-raised p-3 sm:grid-cols-[1fr_8rem_1fr_6rem_auto]"
        >
          <Input
            aria-label="Title"
            placeholder="ICPC Asia Topi, ranked"
            value={item.title}
            maxLength={CAREER_ARC_LIMITS.recognitionField}
            onChange={(event) => setText(item, "title", event.target.value)}
          />
          <Select
            aria-label="Kind"
            className="w-full"
            value={item.kind ?? "other"}
            onChange={(event) =>
              replace({ ...item, kind: event.target.value as CareerArcRecognition["kind"] })
            }
          >
            {RECOGNITION_KINDS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            aria-label="Given by"
            placeholder="Given by"
            value={item.issuer ?? ""}
            maxLength={CAREER_ARC_LIMITS.recognitionField}
            onChange={(event) => setText(item, "issuer", event.target.value)}
          />
          <Input
            aria-label="Year"
            placeholder="Year"
            value={item.year ?? ""}
            maxLength={CAREER_ARC_LIMITS.recognitionField}
            onChange={(event) => setText(item, "year", event.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onChange(items.filter((existing) => existing.id !== item.id))}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon={<PlusIcon />}
        disabled={items.length >= CAREER_ARC_LIMITS.recognition}
        onClick={() => onChange([...items, newRecognition()])}
      >
        Add recognition
      </Button>
    </div>
  );
}
