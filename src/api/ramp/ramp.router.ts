import { createApiResponse } from "@/api-docs/openAPI.ResponseBuilders";
import { API } from "@/common/contants";
// import { validateJwtToken } from "@/common/middleware";
import { expressRouter } from "@/common/utils";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { z } from "zod";
import { rampController } from "./ramp.controller";
import { GetRampType, RampPlatformSchema } from "./ramp.model";

const rampRouter: Router = Router();
const rampRegistry = new OpenAPIRegistry();
rampRegistry.register(API.RAMP, RampPlatformSchema);

const parentRoute = API.RAMP;
// Define API paths and request/response schemas separately
const corsschainApiPaths = [
  {
    method: "get",
    path: `/${parentRoute}/`,
    tags: ["Ramp"],
    request: { query: GetRampType.shape.query },
    responses: createApiResponse(z.array(RampPlatformSchema), "Success"),
    // middleware: [validateJwtToken], // Apply validation middleware before handler
    handler: rampController.getRamps,
  },
];

expressRouter(corsschainApiPaths, rampRegistry, rampRouter);

export { rampRouter, rampRegistry };
