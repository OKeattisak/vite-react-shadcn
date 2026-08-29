import type {
  FieldPath,
  FieldValues,
  UseFormSetError,
} from "react-hook-form";

import { isApiError } from "@/lib/api";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getFieldErrorMessage(value: unknown) {
  if (typeof value === "string" && value.trim()) return value;

  if (Array.isArray(value)) {
    const messages = value.filter(
      (item): item is string => typeof item === "string" && Boolean(item.trim()),
    );

    return messages[0];
  }

  if (isRecord(value) && typeof value.message === "string") {
    return value.message;
  }

  return undefined;
}

function getValidationDetails(details: unknown) {
  if (!isRecord(details)) return undefined;

  return isRecord(details.errors) ? details.errors : details;
}

export function applyApiFieldErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  fields: readonly FieldPath<TFieldValues>[],
) {
  if (
    !isApiError(error) ||
    (error.status !== 400 && error.status !== 422)
  ) {
    return false;
  }

  const details = getValidationDetails(error.details);
  if (!details) return false;

  let hasFieldError = false;

  for (const field of fields) {
    const message = getFieldErrorMessage(details[field]);
    if (!message) continue;

    setError(field, { type: "server", message });
    hasFieldError = true;
  }

  return hasFieldError;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  return isApiError(error) ? error.message : fallback;
}
