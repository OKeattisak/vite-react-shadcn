import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type CreateAxiosDefaults,
} from "axios";

import { env } from "@/config/env";
import {
  getApiAccessToken,
  notifyApiUnauthorized,
} from "@/lib/api/api-auth";
import { toApiError } from "@/lib/api/api-error";

export function createApiClient(
  defaults: CreateAxiosDefaults = {},
): AxiosInstance {
  const client = axios.create({
    baseURL: env.apiUrl,
    timeout: env.apiTimeoutMs,
    withCredentials: env.apiWithCredentials,
    ...defaults,
  });

  if (!client.defaults.headers.common.Accept) {
    client.defaults.headers.common.Accept = "application/json";
  }

  client.interceptors.request.use(async (config) => {
    const accessToken = await getApiAccessToken();

    if (accessToken && !config.headers.has("Authorization")) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const apiError = toApiError(error);

      if (apiError.status === 401) {
        await notifyApiUnauthorized(apiError);
      }

      throw apiError;
    },
  );

  return client;
}

export const apiClient = createApiClient();

export async function apiRequest<TResponse, TRequest = unknown>(
  config: AxiosRequestConfig<TRequest>,
): Promise<TResponse> {
  const response = await apiClient.request<
    TResponse,
    AxiosResponse<TResponse>,
    TRequest
  >(config);

  return response.data;
}
