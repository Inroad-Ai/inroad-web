import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/composed/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Set a new password - Inroad" };

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
