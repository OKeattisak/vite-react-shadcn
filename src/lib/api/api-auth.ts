import type { ApiError } from "@/lib/api/api-error";

type MaybePromise<T> = T | Promise<T>;

export type ApiAuthAdapter = {
  getAccessToken?: () => MaybePromise<string | null>;
  onUnauthorized?: (error: ApiError) => MaybePromise<void>;
};

const emptyAdapter: ApiAuthAdapter = {};
let authAdapter = emptyAdapter;

export function configureApiAuth(adapter: ApiAuthAdapter) {
  authAdapter = adapter;

  return () => {
    if (authAdapter === adapter) {
      authAdapter = emptyAdapter;
    }
  };
}

export async function getApiAccessToken() {
  return (await authAdapter.getAccessToken?.()) ?? null;
}

export async function notifyApiUnauthorized(error: ApiError) {
  try {
    await authAdapter.onUnauthorized?.(error);
  } catch {
    // Keep the original 401 error as the request failure.
  }
}
