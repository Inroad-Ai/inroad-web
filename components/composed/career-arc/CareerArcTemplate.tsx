"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { TEMPLATE_DOCX_PATH, TEMPLATE_MD_PATH } from "@/lib/career-arc";

function download(path: string) {
  const link = document.createElement("a");
  link.href = path;
  link.download = "";
  link.click();
}

export function CareerArcTemplate() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      const response = await fetch(TEMPLATE_MD_PATH);
      if (!response.ok) throw new Error("template unavailable");
      await navigator.clipboard.writeText(await response.text());
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <Card variant="nested" padding="md" className="space-y-4">
      <div>
        <p className="text-sm font-sans-semibold text-ink">Fill in one block per experience</p>
        <p className="mt-1 text-sm text-ink-muted">
          Situation, what you did, why, the trade-offs, the result. Two or three experiences take
          about 15 minutes. Delete the hint text, then upload the file here.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="button" size="sm" onClick={() => download(TEMPLATE_DOCX_PATH)}>
          Download Word template
        </Button>
        <Button type="button" size="sm" variant="quiet" onClick={() => download(TEMPLATE_MD_PATH)}>
          Download Markdown
        </Button>
        <Button type="button" size="sm" variant="quiet" onClick={copy}>
          {copyState === "copied" ? "Copied" : "Copy as text"}
        </Button>
      </div>
      {copyState === "failed" ? (
        <Notice size="xs">Could not copy. Download the Markdown file instead.</Notice>
      ) : null}
    </Card>
  );
}
