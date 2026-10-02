"use client";

import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect warns when a component renders on the server.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
