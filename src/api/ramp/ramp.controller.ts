import { rampService } from "@/api/ramp/ramp.service";
import { handleServiceResponse } from "@/common/utils";
import type { Request, RequestHandler, Response } from "express";

class RampController {
  public getRamps: RequestHandler = async (_req: Request, res: Response) => {
    const { type } :any = _req.query
    const serviceResponse = await rampService.findAll(type);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const rampController = new RampController();
