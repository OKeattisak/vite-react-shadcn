# Forms and validation

Use React Hook Form for form state and Zod for runtime validation. Keep schemas
close to the form or domain that owns them instead of creating one global schema
directory.

## Structure

```text
src/
├─ components/
│  ├─ forms/
│  │  └─ form-field-error.tsx   # Accessible field error message
│  └─ examples/
│     ├─ profile-form.schema.ts # Zod schema and inferred type
│     └─ profile-form.tsx       # Typed form example
└─ lib/forms/
   ├─ api-field-errors.ts       # Maps API validation errors to fields
   └─ index.ts                  # Public exports
```

`ProfileForm` accepts an async `onSubmit` callback. It has no knowledge of the
API endpoint, making the component usable with a TanStack Query mutation or any
other submit implementation.

## Use with a mutation

```tsx
import { useMutation } from "@tanstack/react-query";

import {
  ProfileForm,
} from "@/components/examples/profile-form";
import type { ProfileFormValues } from "@/components/examples/profile-form.schema";
import { apiRequest, type ApiResponse } from "@/lib/api";

function updateProfile(values: ProfileFormValues) {
  return apiRequest<ApiResponse<ProfileFormValues>, ProfileFormValues>({
    method: "PUT",
    url: "/profile",
    data: values,
  });
}

export function ProfileSettings() {
  const updateProfileMutation = useMutation({ mutationFn: updateProfile });

  return <ProfileForm onSubmit={updateProfileMutation.mutateAsync} />;
}
```

The form catches errors from `mutateAsync`. A 400 or 422 `ApiError` with field
details is mapped to matching React Hook Form fields. Other errors appear as a
root form error.

Supported field detail shapes include:

```json
{
  "displayName": ["Display name is already in use"],
  "email": "Email is already registered"
}
```

and:

```json
{
  "errors": {
    "email": {
      "message": "Email is already registered"
    }
  }
}
```

Always pass an explicit field allowlist to `applyApiFieldErrors`. This prevents
unexpected server keys from being registered as form paths.

## Guidelines

- Use uncontrolled native inputs with `register`.
- Use `Controller` only for controlled components such as custom date pickers.
- Disable submit controls while `formState.isSubmitting` is true.
- Use `noValidate` when Zod is the source of validation messages.
- Keep mutation and cache invalidation outside reusable presentational forms.
- Translate validation messages in the application domain when localization is
  required; the included profile form is a copyable scaffold example.
