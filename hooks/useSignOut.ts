"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { signOutNative } from "@/lib/auth-native/browser";

export function useSignOut() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    await signOutNative();
    router.push("/");
    router.refresh();
  }, [router]);

  return { signOut, signingOut };
}
