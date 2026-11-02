"use client";

import { useState } from "react";

import { Tabs } from "@/components/ui/Tabs";
import { SearchIcon, TargetIcon } from "@/components/ui/Icons";

import { CompanyResearchTab } from "./CompanyResearchTab";
import { MatchScanTab } from "./MatchScanTab";
import { useMatchScans } from "./useMatchScans";

const MODES = [
  { id: "company", label: "Research a company", icon: SearchIcon },
  { id: "match", label: "Find companies for me", icon: TargetIcon },
];

/** Two ways in, one at a time: a company you already have in mind, or
 * companies your profile finds. */
export function ResearchWorkspace() {
  const [mode, setMode] = useState("company");
  const scans = useMatchScans();

  return (
    <div className="flex flex-col gap-6">
      <Tabs items={MODES} activeId={mode} onChange={setMode} />
      {mode === "company" ? <CompanyResearchTab /> : <MatchScanTab scans={scans} />}
    </div>
  );
}
