import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FormFieldError } from "@/components/forms/form-field-error";
import {
  profileFormSchema,
  type ProfileFormValues,
} from "@/components/examples/profile-form.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applyApiFieldErrors, getApiErrorMessage } from "@/lib/forms";

const profileFieldNames = ["displayName", "email"] as const;

type ProfileFormProps = {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => Promise<void> | void;
};

export function ProfileForm({
  defaultValues,
  onSubmit,
}: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: defaultValues?.displayName ?? "",
      email: defaultValues?.email ?? "",
    },
  });

  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = form;

  async function submit(values: ProfileFormValues) {
    clearErrors("root");

    try {
      await onSubmit(values);
    } catch (error) {
      const hasFieldErrors = applyApiFieldErrors(
        error,
        setError,
        profileFieldNames,
      );

      if (!hasFieldErrors) {
        setError("root.server", {
          type: "server",
          message: getApiErrorMessage(
            error,
            "We could not save your changes. Please try again.",
          ),
        });
      }
    }
  }

  return (
    <form
      className="grid max-w-md gap-4"
      noValidate
      onSubmit={handleSubmit(submit)}
    >
      <div className="grid gap-2">
        <Label htmlFor="profile-display-name">Display name</Label>
        <Input
          id="profile-display-name"
          autoComplete="name"
          aria-invalid={Boolean(errors.displayName)}
          aria-describedby={
            errors.displayName ? "profile-display-name-error" : undefined
          }
          disabled={isSubmitting}
          {...register("displayName")}
        />
        <FormFieldError id="profile-display-name-error">
          {errors.displayName?.message}
        </FormFieldError>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="profile-email">Email</Label>
        <Input
          id="profile-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "profile-email-error" : undefined}
          disabled={isSubmitting}
          {...register("email")}
        />
        <FormFieldError id="profile-email-error">
          {errors.email?.message}
        </FormFieldError>
      </div>

      <FormFieldError>{errors.root?.server?.message}</FormFieldError>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
