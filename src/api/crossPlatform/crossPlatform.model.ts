import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils";

extendZodWithOpenApi(z);

export type crossPlatform = z.infer<typeof CrossPlatformSchema>;

export const CrossPlatformSchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
  apiUrl: z.string(),
  description: z.string(),
});

// Input Validation for 'GET CrossPlatform/:id' endpoint
export const GetCrossPlatformSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
