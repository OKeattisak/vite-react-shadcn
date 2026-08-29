# TanStack Query

TanStack Query owns server state: data loaded from APIs that can become stale
and needs caching, refetching, or synchronization. Axios remains responsible for
HTTP transport, and Zustand remains responsible for client-side preferences.

## Configuration

The shared `QueryClient` lives in `src/lib/query/query-client.ts` and is mounted
once in `src/main.tsx`.

The defaults are intentionally conservative:

- Query results stay fresh for 30 seconds.
- Network, timeout, unknown, and 5xx errors retry up to two times.
- 4xx responses do not retry.
- Window-focus refetching is disabled to avoid surprising requests.
- Mutations do not retry automatically because writes may not be idempotent.

Override these defaults per query when an endpoint has different requirements.

## Query keys

Build keys from broad to specific and include every value used by the query
function:

```ts
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: PaginationParams) =>
    [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

Keep domain-specific keys near the corresponding API functions or hooks. Do
not put every application's keys in the shared query client.

## Paginated query

The API function unwraps the standard response envelope so components receive
only the useful data:

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
  params: PaginationParams,
): Promise<PaginatedData<UserDto>> {
  const response = await apiRequest<PaginatedResponse<UserDto>>({
    method: "GET",
    url: "/users",
    params,
  });

  return response.data;
}
```

The hook includes pagination in its query key. `placeholderData` keeps the
previous page visible while the next page loads:

```ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useUsers(params: PaginationParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
}
```

Render initial loading separately from background fetching:

```tsx
const usersQuery = useUsers({ page, pageSize: 20 });

if (usersQuery.isPending) return <PageLoader />;
if (usersQuery.isError) return <ErrorState error={usersQuery.error} />;

return (
  <>
    <UserList users={usersQuery.data.items} />
    {usersQuery.isFetching && <span>Refreshing...</span>}
  </>
);
```

## Mutations

Invalidate related queries after a successful write. Do not manually duplicate
the server's list state in Zustand.

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  });
}
```

Use `mutate` for event handlers and read `isPending` to disable duplicate
submissions.
