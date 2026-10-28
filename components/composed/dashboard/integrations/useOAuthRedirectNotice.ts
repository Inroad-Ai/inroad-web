"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { labelFor } from "./providers";

export interface RedirectNotice {
  text: string;
  isError: boolean;
  /** Which provider the connect was for. */
  provider: string | null;
}

/** Reads connected / connect_error off the URL after the OAuth redirect
 * lands back here, shows a one-line banner, then strips the query string so
 * a refresh doesn't repeat it. */
export function useOAuthRedirectNotice(): RedirectNotice | null {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState<RedirectNotice | null>(null);

  useEffect(() => {
    const error = searchParams.get("connect_error");
    const connected = searchParams.get("connected");
    if (!error && !connected) return;

    const provider = error ? searchParams.get("provider") : connected;
    const label = labelFor(provider);
    setNotice(
      error
        ? { text: `Could not connect ${label}. Try again.`, isError: true, provider }
        : { text: `${label} connected.`, isError: false, provider },
    );
    router.replace(pathname);
    // Only ever runs once per landing: router.replace above changes the URL,
    // which would otherwise re-trigger this on the params it just cleared.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return notice;
}
