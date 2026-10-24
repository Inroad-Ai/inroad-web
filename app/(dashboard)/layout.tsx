import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/composed/dashboard/DashboardShell";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-native/constants";
import { verifyAccessToken } from "@/lib/auth-native/verify";

// Every route under (dashboard) requires a signed-in user: the access token
// is verified against JWT_SECRET, not just trusted from the cookie.
// middleware.ts already ran and refreshed it if it was expired, so this is a
// plain verify, not a second refresh attempt - a Server Component can't
// persist a refreshed cookie back to the browser anyway.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  const userId = accessToken ? await verifyAccessToken(accessToken) : null;

  if (!userId) {
    redirect("/");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
