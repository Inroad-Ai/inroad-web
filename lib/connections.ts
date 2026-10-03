import { startOAuth, type OAuthProvider } from "@/lib/api-client/client";
import { ensureValidAccessToken } from "@/lib/auth-native/browser";

export async function redirectToProvider(provider: OAuthProvider): Promise<void> {
  const token = await ensureValidAccessToken();
  if (!token) throw new Error("Your session expired. Sign in again.");

  window.location.href = await startOAuth(provider, token);
}
