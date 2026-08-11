import type { Metadata } from "next";

import { AuthForm } from "@/components/composed/auth/AuthForm";

export const metadata: Metadata = { title: "Create your account - Inroad" };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
