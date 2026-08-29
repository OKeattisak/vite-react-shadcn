import { z } from "zod";

export const profileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must contain at least 2 characters")
    .max(80, "Display name must contain at most 80 characters"),
  email: z.string().trim().email("Enter a valid email address"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
