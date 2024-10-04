import type { Router } from "express";
import { z } from "zod";
import { API } from "../contants";

// Define the Zod schemas
const ApiRequestSchema = z.object({
  body: z.any().optional(),
  params: z.any().optional(),
  query: z.any().optional(),
  headers: z.any().optional(),
});

const ApiPathSchema = z.object({
  method: z.string(),
  path: z.string(),
  tags: z.array(z.string()).optional(),
  request: ApiRequestSchema.optional(),
  responses: z.any().optional(),
  middleware: z.union([z.function(), z.array(z.function())]).optional(),
  handler: z.function(),
});

const ApiMethodsSchema = z.array(ApiPathSchema);

interface Registry {
  registerPath: (path: any) => void;
}
/**
 * expressRouter is a function that takes an array of API methods, a Registry instance, and an Express Router instance.
 * It validates the API methods using Zod, then registers the paths and middlewares to the provided Router instance.
 *
 * @param apiMethods - An array of API methods, each represented by an object containing method, path, tags, request, responses, middleware, and handler properties.
 * @param registry - A Registry instance that has a registerPath method to register API paths.
 * @param router - An Express Router instance where the API paths and middlewares will be registered.
 *
 * @returns void - The function does not return any value, but registers the API paths and middlewares to the provided Router instance.
 */
function expressRouter(apiMethods: unknown, registry: Registry, router: Router): void {
  // Validate the apiMethods using Zod
  const parsedApiMethods = ApiMethodsSchema.parse(apiMethods);

  parsedApiMethods.forEach(({ method, path, tags, request, responses, middleware, handler }) => {
    let path_ = API.BASE_URL + path;

    const register: any = { method, path: path_, tags, responses };

    if (request) {
      const { body, params, query, headers } = request;
      const request_: any = {};

      if (body) {
        request_.body = {
          content: {
            "application/json": {
              schema: body,
            },
          },
        };
      }
      if (params) request_.params = params;
      if (query) register.query = query;
      if (headers) request_.headers = headers;

      register.request = request_;
    }

    registry.registerPath(register);
    path_ = path.replace(/{(.*?)}/g, ":$1");
    const middlewares = Array.isArray(middleware) ? middleware : middleware ? [middleware] : [];
    (router as any)[method](path_, ...middlewares, handler);
  });
}

export default expressRouter;
