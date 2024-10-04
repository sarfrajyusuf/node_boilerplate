import { createApiResponse } from "@/api-docs/openAPI.ResponseBuilders";
import { userController } from "@/api/user/user.controller";
import { AddUserSchemaBody, GetUserSchema, LoginSchemaBody, UserSchema } from "@/api/user/user.model";
import { API } from "@/common/contants";
import { validateJwtToken } from "@/common/middleware";
import { HeadersSchema, expressRouter, validateRequest } from "@/common/utils";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { z } from "zod";

const userRouter: Router = Router();
const userRegistry = new OpenAPIRegistry();
userRegistry.register(API.USER, UserSchema);

const parentRoute = API.USER;
// Define API paths and request/response schemas separately
const userApiPaths = [
  {
    method: "get",
    path: `/${parentRoute}/`,
    tags: ["User"],
    request: { headers: HeadersSchema },
    responses: createApiResponse(z.array(UserSchema), "Success"),
    middleware: [validateJwtToken], // Apply validation middleware before handler
    handler: userController.getUsers,
  },
  {
    method: "get",
    path: `/${parentRoute}/{id}`,
    tags: ["User"],
    request: { params: GetUserSchema.shape.params, headers: HeadersSchema },
    responses: createApiResponse(UserSchema, "Success"),
    middleware: [validateRequest(GetUserSchema), validateJwtToken], // Apply validation middleware before handler
    handler: userController.getUser,
  },
  {
    method: "post",
    path: `/${parentRoute}/register`,
    tags: ["User"],
    request: { body: AddUserSchemaBody.shape.body },
    responses: createApiResponse(UserSchema, "Success"),
    middleware: [validateRequest(AddUserSchemaBody)], // Apply validation middleware before handler
    handler: userController.addUser,
  },
  {
    method: "post",
    path: `/${parentRoute}/sign-in`,
    tags: ["User"],
    request: { body: LoginSchemaBody.shape.body },
    responses: createApiResponse(UserSchema, "Success"),
    middleware: [validateRequest(LoginSchemaBody)], // Apply validation middleware before handler
    handler: userController.logIn,
  },
];

expressRouter(userApiPaths, userRegistry, userRouter);

export { userRouter, userRegistry };
