import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/composed/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset your password - Inroad" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
