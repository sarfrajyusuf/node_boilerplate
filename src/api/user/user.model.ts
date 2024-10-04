import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.number(),
  status: z.number(),
});

// Input Validation for 'GET users/:id' endpoint
// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const AddUserSchemaBody = z.object({
  body: z
    .object({
      name: z.string({ invalid_type_error: "Invalid name", required_error: "Name is required" }),
      phone: z.number({ invalid_type_error: "Invalid phone no", required_error: "phone is required" }),
      password: z.string({ invalid_type_error: "Invalid password", required_error: "password is required" }),
      email: z
        .string({ invalid_type_error: "Invalid email", required_error: "email is required" })
        .email({ message: "Invalid email format" }),
    })
    .required(),
});

export const LoginSchemaBody = z.object({
  body: z
    .object({
      email: z
        .string({ invalid_type_error: "Invalid email", required_error: "email is required" })
        .email({ message: "Invalid email format" }),
      password: z.string({ invalid_type_error: "Invalid password", required_error: "password is required" }),
    })
    .required(),
});
