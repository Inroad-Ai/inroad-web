"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const openNav = useCallback(() => setOpen(true), []);
  const closeNav = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return { open, openNav, closeNav };
}
