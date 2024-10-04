import { createApiResponse } from "@/api-docs/openAPI.ResponseBuilders";
import { API } from "@/common/contants";
// import { validateJwtToken } from "@/common/middleware";
import { expressRouter } from "@/common/utils";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { z } from "zod";
import { crosschainPlatformController } from "./crossPlarform.controller";
import { CrossPlatformSchema } from "./crossPlatform.model";

const crosschainRouter: Router = Router();
const crosschainRegistry = new OpenAPIRegistry();
crosschainRegistry.register(API.CROSSCHAINPLATFORM, CrossPlatformSchema);

const parentRoute = API.CROSSCHAINPLATFORM;
// Define API paths and request/response schemas separately
const corsschainApiPaths = [
  {
    method: "get",
    path: `/${parentRoute}/`,
    tags: ["Cross-chain-plaform"],
    // request: { headers: HeadersSchema },
    responses: createApiResponse(z.array(CrossPlatformSchema), "Success"),
    // middleware: [validateJwtToken], // Apply validation middleware before handler
    handler: crosschainPlatformController.getCrosschainPlatform,
  },
];

expressRouter(corsschainApiPaths, crosschainRegistry, crosschainRouter);

export { crosschainRouter, crosschainRegistry };
