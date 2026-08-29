# API client

The shared Axios infrastructure lives in `src/lib/api`. Application code should
not configure Axios globally or import the default `axios` export directly.

## Structure

```text
src/
├─ config/
│  └─ env.ts                 # Validated public runtime configuration
├─ lib/api/
│  ├─ api-auth.ts            # Optional auth adapter
│  ├─ api-client.ts          # Axios instance and data helper
│  ├─ api-error.ts           # Normalized request errors
│  └─ index.ts               # Public API surface
```

## Environment variables

Copy `.env.example` to a mode-specific environment file when needed.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | Absolute HTTP(S) URL or root-relative API path |
| `VITE_API_TIMEOUT_MS` | `15000` | Positive request timeout in milliseconds |
| `VITE_API_WITH_CREDENTIALS` | `false` | Include credentials on cross-origin requests |

All `VITE_` variables are visible in the browser bundle. They must never contain
secrets.

## Standard responses

Successful endpoints use a common envelope:

```ts
import type { ApiResponse } from "@/lib/api";

type ProfileResponse = ApiResponse<{
  id: string;
  name: string;
}>;
```

Page-based list endpoints use `PaginatedResponse<T>`, whose `data` contains
`items` and pagination metadata:

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [{ "id": "1", "name": "John" }],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 125,
      "totalPages": 7
    }
  }
}
```

Error responses use this shape and are normalized into `ApiError`:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "page": ["Page must be greater than zero"]
    }
  }
}
```

## Endpoint example

Application code can compose the shared response types without changing the
Axios client.

```ts
import {
  apiRequest,
  type PaginatedData,
  type PaginatedResponse,
  type PaginationParams,
} from "@/lib/api";

export type UserDto = {
  id: string;
  name: string;
};

export async function getUsers(
  params: PaginationParams = {},
): Promise<PaginatedData<UserDto>> {
  const response = await apiRequest<PaginatedResponse<UserDto>>({
    method: "GET",
    url: "/users",
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
    },
  });

  return response.data;
}
```

Callers receive the feature data without knowing about the transport envelope:

```ts
const { items, pagination } = await getUsers({
  page: 1,
  pageSize: 20,
});
```

Use `apiClient` directly when response status or headers are required:

```ts
import { apiClient } from "@/lib/api";

const response = await apiClient.get<UserDto[]>("/users");
const requestId = response.headers["x-request-id"];
```

## Error handling

Every Axios failure is converted to `ApiError`. UI code can branch on a stable
kind instead of Axios internals.

```ts
import { isApiError } from "@/lib/api";

try {
  await getUsers();
} catch (error) {
  if (isApiError(error)) {
    if (error.status === 422) {
      // Map error.details to form fields.
    }
  }

  throw error;
}
```

Supported kinds are `http`, `network`, `timeout`, and `unknown`.
The error may also include the HTTP status, server code, response details, and
`x-request-id`.

## Server state

Use TanStack Query to cache and synchronize data returned by this API layer.
Axios remains responsible for transport and error normalization. See
[`docs/tanstack-query.md`](./tanstack-query.md) for query keys, pagination, and
mutation examples.

## Authentication

The API layer does not decide where credentials are stored or how navigation
works. Configure those policies once during application bootstrap:

```ts
import { configureApiAuth } from "@/lib/api";

configureApiAuth({
  getAccessToken: () => authSession.getState().accessToken,
  onUnauthorized: () => authSession.getState().signOut(),
});
```

The example assumes an application-specific `authSession`; it is intentionally
not included in the scaffold. For cookie-based sessions, omit
`getAccessToken` and enable `VITE_API_WITH_CREDENTIALS` only when cross-origin
cookies are required.

Token refresh and retry logic should be implemented with the chosen auth system,
not inside the generic scaffold client. This prevents retry loops and duplicate
refresh requests.

## Forms

Use `applyApiFieldErrors` to map validation details from a 400 or 422
`ApiError` into React Hook Form. See [`docs/forms.md`](./forms.md) for the typed
Zod form and TanStack Query mutation example.
