/** Server-only. Verifies a native-auth access token's HS256 signature
 * against the same secret inroad-api signs with (JWT_SECRET, mirrored into
 * this app's server-only env - see .env.example). Used by middleware.ts and
 * (dashboard)/layout.tsx, the two places that decide whether a request is
 * allowed into a gated route; nothing client-side imports this.
 *
 * jose, not jsonwebtoken: jsonwebtoken needs Node's crypto module directly,
 * which isn't available in the Edge runtime middleware.ts runs in. jose
 * works in both.
 */

import { jwtVerify } from "jose";

const secret = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;

export async function verifyAccessToken(token: string): Promise<string | null> {
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    // Expired, bad signature, malformed - all the same outcome here: not a
    // valid session.
    return null;
  }
}
