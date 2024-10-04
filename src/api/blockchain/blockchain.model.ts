import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils";

extendZodWithOpenApi(z);

export type blockchain = z.infer<typeof BlockchainSchema>;

export const BlockchainSchema = z.object({
  id: z.number(),
  name: z.string(),
  chainId: z.number(),
  symbol: z.string(),
  rpcUrl: z.string(),
  explorerUrl: z.string(),
});

// Input Validation for 'GET blockchain/:id' endpoint
export const GetBlockchainSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
