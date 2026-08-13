import type { Metadata } from "next";

import { VerifyEmail } from "@/components/composed/auth/VerifyEmail";

export const metadata: Metadata = { title: "Confirming your email - Inroad" };

// Reads the token from the query string at request time.
export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  return <VerifyEmail />;
}
