import * as Sentry from "@sentry/nextjs";

const sentryPrivacyOptions = { sendDefaultPii: false } as const;

const dsn = process.env.SENTRY_DSN;
if (dsn) {
  Sentry.init({
    ...sentryPrivacyOptions,
    dsn,
    environment: process.env.INROAD_ENV ?? "development",
    tracesSampleRate: 0,
    beforeSend(event) {
      delete event.request;
      delete event.user;
      return event;
    },
  });
}
