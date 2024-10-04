import { crossPlatformService } from "@/api/crossPlatform/crossPlatform.service";
import { handleServiceResponse } from "@/common/utils";
import type { Request, RequestHandler, Response } from "express";

class CrosschainPlatformController {
  public getCrosschainPlatform: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await crossPlatformService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };
}

export const crosschainPlatformController = new CrosschainPlatformController();
