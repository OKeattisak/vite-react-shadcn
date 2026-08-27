export {
  apiClient,
  apiRequest,
  createApiClient,
} from "@/lib/api/api-client";
export {
  ApiError,
  isApiError,
  toApiError,
  type ApiErrorKind,
} from "@/lib/api/api-error";
export {
  configureApiAuth,
  type ApiAuthAdapter,
} from "@/lib/api/api-auth";
export type {
  ApiErrorResponse,
  ApiResponse,
  PaginatedData,
  PaginatedResponse,
  PaginationMeta,
  PaginationParams,
} from "@/lib/api/api-types";
