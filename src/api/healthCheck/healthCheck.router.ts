import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPI.ResponseBuilders";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils";

export const healthCheckRegistry = new OpenAPIRegistry();
export const healthCheckRouter: Router = express.Router();

import os from "node:os";
import process from "node:process";
import { API } from "@/common/contants";

healthCheckRegistry.registerPath({
  method: "get",
  path: `${API.BASE_URL}/health-check`,
  tags: ["Health Check"],
  responses: createApiResponse(z.null(), "Success"),
});

healthCheckRouter.get("/", (_req: Request, res: Response) => {
  // Gather system information
  const heap = {
    total: process.memoryUsage().heapTotal,
    used: process.memoryUsage().heapUsed,
  };
  const systemInfo = {
    uptime: os.uptime(),
    freeMemory: os.freemem(),
    totalMemory: os.totalmem(),
    cpuUsage: process.cpuUsage(),
  };

  // Combine all information
  const data = {
    heap,
    systemInfo,
  };

  // Create a successful response with detailed information
  const serviceResponse = ServiceResponse.success("Service is healthy", data);
  return handleServiceResponse(serviceResponse, res);
});
