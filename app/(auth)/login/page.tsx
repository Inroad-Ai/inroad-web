import type { Metadata } from "next";

import { AuthForm } from "@/components/composed/auth/AuthForm";

export const metadata: Metadata = { title: "Sign in - Inroad" };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
