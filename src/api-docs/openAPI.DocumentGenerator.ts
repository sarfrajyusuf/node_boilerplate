import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { blockchainRegistry } from "@/api/blockchain/blockchain.router";
import { crosschainRegistry } from "@/api/crossPlatform/crossPlatform.router";
import { healthCheckRegistry } from "@/api/healthCheck/healthCheck.router";
import { userRegistry } from "@/api/user/user.router";
import { rampRegistry } from "@/api/ramp/ramp.router";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry, blockchainRegistry, crosschainRegistry, rampRegistry]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
