import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/composed/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Set a new password - Inroad" };

// Reads the reset token from the query string at request time.
export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
