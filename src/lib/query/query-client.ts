import { QueryClient } from "@tanstack/react-query";

import { isApiError } from "@/lib/api";

const MAX_QUERY_RETRIES = 2;

function shouldRetry(failureCount: number, error: unknown) {
  if (failureCount >= MAX_QUERY_RETRIES) return false;

  if (isApiError(error) && error.status) {
    return error.status >= 500;
  }

  return true;
}

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export const queryClient = createAppQueryClient();
