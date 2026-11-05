import * as Sentry from "@sentry/nextjs";

// Sentry v11's public TypeScript union omits this long-standing privacy
// option, but keeping it in the runtime configuration makes the intent
// explicit and preserves the secure setting across SDK compatibility paths.
const sentryPrivacyOptions = { sendDefaultPii: false } as const;

const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    ...sentryPrivacyOptions,
    dsn: sentryDsn,
    environment: process.env.NEXT_PUBLIC_INROAD_ENV ?? "development",
    tracesSampleRate: 0,
    beforeSend(event) {
      delete event.request;
      delete event.user;
      return event;
    },
  });
}
