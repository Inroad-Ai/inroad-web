/** Shared between the browser cookie helpers and the server-side verifier.
 * TTLs mirror inroad-api's app/core/security.py ACCESS_TOKEN_TTL /
 * REFRESH_TOKEN_TTL - there's no single source of truth across the two
 * codebases, so if one changes, change the other. */

export const ACCESS_TOKEN_COOKIE = "inroad_access_token";
export const REFRESH_TOKEN_COOKIE = "inroad_refresh_token";

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
