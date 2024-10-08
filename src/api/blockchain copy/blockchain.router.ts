import { createApiResponse } from "@/api-docs/openAPI.ResponseBuilders";
import { API } from "@/common/contants";
// import { validateJwtToken } from "@/common/middleware";
import { expressRouter } from "@/common/utils";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { z } from "zod";
import { blockchainController } from "./blockchain.controller";
import { BlockchainSchema } from "./blockchain.model";

const blockchainRouter: Router = Router();
const blockchainRegistry = new OpenAPIRegistry();
blockchainRegistry.register(API.BLOCKCHAIN, BlockchainSchema);

const parentRoute = API.BLOCKCHAIN;
// Define API paths and request/response schemas separately
const blockchainApiPaths = [
  {
    method: "get",
    path: `/${parentRoute}/`,
    tags: ["Blockchain"],
    // request: { headers: HeadersSchema },
    responses: createApiResponse(z.array(BlockchainSchema), "Success"),
    // middleware: [validateJwtToken], // Apply validation middleware before handler
    handler: blockchainController.getBlockchain,
  },
];

expressRouter(blockchainApiPaths, blockchainRegistry, blockchainRouter);

export { blockchainRouter, blockchainRegistry };
