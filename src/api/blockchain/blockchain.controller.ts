import { blockchainService } from "@/api/blockchain/blockchain.service";
import { handleServiceResponse } from "@/common/utils";
import type { Request, RequestHandler, Response } from "express";

class BlockchainController {
  public getBlockchain: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await blockchainService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };
}

export const blockchainController = new BlockchainController();
