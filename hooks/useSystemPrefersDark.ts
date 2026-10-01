"use client";

import { useSyncExternalStore } from "react";

import { DARK_MEDIA_QUERY } from "@/lib/theme/theme.constants";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DARK_MEDIA_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(DARK_MEDIA_QUERY).matches;
}

export function useSystemPrefersDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
