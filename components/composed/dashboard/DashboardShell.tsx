"use client";

import { useEffect, useState, type ReactNode } from "react";

import { DashboardHeader } from "@/components/composed/dashboard/DashboardHeader";
import { Sidebar } from "@/components/composed/dashboard/Sidebar";

const COLLAPSE_KEY = "inroad:sidebar-collapsed";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Read the saved preference after mount only, so server and first client
  // render match and there is no hydration flash.
  useEffect(() => {
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
