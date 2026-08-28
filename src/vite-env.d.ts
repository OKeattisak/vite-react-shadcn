/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
  readonly VITE_API_WITH_CREDENTIALS?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENABLED?: string;
  readonly VITE_SENTRY_ENVIRONMENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
