import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Next invokes this for server request errors. Sentry's server configuration
// removes request/user data before the event can leave the application.
export const onRequestError = Sentry.captureRequestError;
