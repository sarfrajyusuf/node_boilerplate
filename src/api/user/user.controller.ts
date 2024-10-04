import { userService } from "@/api/user/user.service";
import { handleServiceResponse } from "@/common/utils";
import type { Request, RequestHandler, Response } from "express";

class UserController {
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public addUser: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public logIn: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.loginUser(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const userController = new UserController();
