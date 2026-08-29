import * as React from "react";

import { cn } from "@/lib/utils";

export function FormFieldError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  if (!children) return null;

  return (
    <p
      role="alert"
      data-slot="form-field-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
}
