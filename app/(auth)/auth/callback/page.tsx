import type { Metadata } from "next";

import { GoogleCallback } from "@/components/composed/auth/GoogleCallback";

export const metadata: Metadata = { title: "Signing you in - Inroad" };

export default function GoogleCallbackPage() {
  return <GoogleCallback />;
}
