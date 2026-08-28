import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();
const enabled = import.meta.env.VITE_SENTRY_ENABLED === "true" && Boolean(dsn);

if (enabled) {
  Sentry.init({
    dsn,
    environment:
      import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,

    sendDefaultPii: false,
  });
}
