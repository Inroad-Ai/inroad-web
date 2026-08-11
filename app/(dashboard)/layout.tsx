import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/composed/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";

// Every route under (dashboard) requires a signed-in user. This is the only
// gate: no route below re-checks auth, they all rely on this layout running
// first. getUser() (not getSession()) because it re-validates against
// Supabase Auth rather than trusting whatever the cookie claims.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
