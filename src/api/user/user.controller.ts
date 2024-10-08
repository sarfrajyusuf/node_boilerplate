import { userService } from "@/api/user/user.service";
import { handleServiceResponse } from "@/common/utils";
import type { Request, RequestHandler, Response } from "express";

class UserController {
  public getUsers: RequestHandler = async (req: Request, res: Response) => {
    const searchQuery = req.query.search as string | undefined;
    const serviceResponse = await userService.findAll(searchQuery);
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
  public sendOtp: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.sendAuthOtp(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
  public verifyOtp: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.verifyOtp(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
  public forgotPasswrod: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.forgotPassword(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
  public resetPassword: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.resetPassword(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
  public changePassword: RequestHandler = async (req: Request, res: Response) => {
    console.log("HHHHHHHHHHH")
    const serviceResponse = await userService.changePassword(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
  public getAuthQr: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.googleAuth(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

}

export const userController = new UserController();
