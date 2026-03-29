import { z } from "zod";

// Event registration validation schema
export const eventRegistrationSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .max(30, "Phone must be less than 30 characters")
    .optional()
    .or(z.literal("")),
  notes: z.string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type EventRegistrationFormData = z.infer<typeof eventRegistrationSchema>;
