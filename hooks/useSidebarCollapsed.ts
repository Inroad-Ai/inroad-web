"use client";

import { useCallback, useEffect, useState } from "react";

import { readStorage, writeStorage } from "@/lib/browser-storage";

const SIDEBAR_COLLAPSE_KEY = "inroad:sidebar-collapsed";

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(false);

  // Read the saved preference after mount only, so server and first client
  // render match and there is no hydration flash.
  useEffect(() => {
    setCollapsed(readStorage(SIDEBAR_COLLAPSE_KEY) === "1");
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      writeStorage(SIDEBAR_COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  return { collapsed, toggle };
}
