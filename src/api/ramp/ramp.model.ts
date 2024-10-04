import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils";

extendZodWithOpenApi(z);

export type ramp = z.infer<typeof RampPlatformSchema>;

const rampType: any = ['ON-RAMP', 'OFF-RAMP']

export const RampPlatformSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(rampType),
  isActive: z.boolean(),
  apiUrl: z.string(),
  description: z.string(),
});

// Input Validation for 'GET ramp/:id' endpoint
export const GetRampPlatformSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Input Validation for 'GET ramp/:id' endpoint
export const GetRampType = z.object({
  query: z.object({ type: z.enum(rampType) }).optional(),
});