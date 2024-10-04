import { z } from "zod";

// Common validations
export const commonValidations = {
  id: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), { message: "ID must be a numeric value" })
    .transform((data) => Number(data))
    .refine((num) => num > 0, { message: "ID must be a positive number" }),
  // ... other common validations
};

// Define headers schema
export const HeadersSchema = z.object({
  "Content-Type": z.string().optional(), // Example: Content-Type header is optional
  "api-access-token": z.string({
    invalid_type_error: "Invalid api-access-token",
    required_error: "api-access-token is required",
  }), // Example:
});
