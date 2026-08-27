import axios from "axios";

export type ApiErrorKind =
  | "http"
  | "network"
  | "timeout"
  | "unknown";

type ApiErrorOptions = {
  kind: ApiErrorKind;
  status?: number;
  code?: string;
  details?: unknown;
  requestId?: string;
  cause?: unknown;
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(message: string, options: ApiErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.kind = options.kind;
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.requestId = options.requestId;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getResponseMessage(data: unknown) {
  if (typeof data === "string" && data.trim()) return data;
  if (!isRecord(data)) return undefined;

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }

  return undefined;
}

function getResponseCode(data: unknown) {
  if (!isRecord(data)) return undefined;

  if (typeof data.code === "string") return data.code;

  if (isRecord(data.error) && typeof data.error.code === "string") {
    return data.error.code;
  }

  return undefined;
}

function getResponseDetails(data: unknown) {
  if (!isRecord(data)) return data;

  if (isRecord(data.error) && "details" in data.error) {
    return data.error.details;
  }

  return data;
}

function getRequestId(headers: unknown) {
  if (!isRecord(headers)) return undefined;

  const requestId = headers["x-request-id"];

  if (typeof requestId === "string") return requestId;
  if (Array.isArray(requestId)) return requestId[0];

  return undefined;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new ApiError("The request timed out", {
        kind: "timeout",
        code: error.code,
        cause: error,
      });
    }

    if (error.response) {
      const { data, headers, status } = error.response;

      return new ApiError(
        getResponseMessage(data) || `The request failed with status ${status}`,
        {
          kind: "http",
          status,
          code: getResponseCode(data) || error.code,
          details: getResponseDetails(data),
          requestId: getRequestId(headers),
          cause: error,
        },
      );
    }

    if (error.request) {
      return new ApiError("The server could not be reached", {
        kind: "network",
        code: error.code,
        cause: error,
      });
    }

    return new ApiError(error.message || "The request could not be created", {
      kind: "unknown",
      code: error.code,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message, {
      kind: "unknown",
      cause: error,
    });
  }

  return new ApiError("An unknown API error occurred", {
    kind: "unknown",
    details: error,
    cause: error,
  });
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
