import { z } from "zod";

// Membership form validation schema
export const membershipSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name must be less than 100 characters"),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().max(30, "Phone must be less than 30 characters").optional().or(z.literal("")),
  address: z.string().max(200, "Address must be less than 200 characters").optional().or(z.literal("")),
  city: z.string().max(100, "City must be less than 100 characters").optional().or(z.literal("")),
  country: z.string().max(100, "Country must be less than 100 characters").optional().or(z.literal("")),
  postalCode: z.string().max(20, "Postal code must be less than 20 characters").optional().or(z.literal("")),
  organization: z.string().max(200, "Organization must be less than 200 characters").optional().or(z.literal("")),
  howHeard: z.string().max(100, "Selection must be less than 100 characters").optional().or(z.literal("")),
  interests: z.array(z.string().max(100)).max(20, "Too many interests selected"),
  newsletter: z.boolean(),
});

export type MembershipFormData = z.infer<typeof membershipSchema>;

// Survey form validation schema
export const surveySchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters").optional().or(z.literal("")),
  email: z.string().email("Invalid email address").max(255).optional().or(z.literal("")),
  surveyType: z.string().min(1, "Survey type is required"),
  responses: z.record(
    z.union([
      z.string().max(5000, "Response is too long"),
      z.array(z.string().max(500)).max(20),
    ])
  ),
});

export type SurveyFormData = z.infer<typeof surveySchema>;

// Newsletter form validation schema
export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  name: z.string().max(100, "Name must be less than 100 characters").optional().or(z.literal("")),
  subscriberType: z.string().max(50, "Subscriber type must be less than 50 characters"),
  interests: z.array(z.string().max(100)).max(10, "Too many interests selected"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Validation helper function
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { isValid: true, errors: {} };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return { isValid: false, errors };
}
