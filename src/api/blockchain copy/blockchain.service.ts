import type { blockchain } from "@/api/blockchain/blockchain.model";
import { BlockchainRepository } from "@/api/blockchain/blockchain.repository";
import { BLOCKCHAIN_MESSAGES, GLOBAL_MESSAGES } from "@/common/contants/index";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

export class BlockchainService {
  private blockchainRepository: BlockchainRepository;

  constructor(repository: BlockchainRepository = new BlockchainRepository()) {
    this.blockchainRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<blockchain[] | null>> {
    try {
      const blockchain = await this.blockchainRepository.findAllAsync();
      if (!blockchain || blockchain.length === 0) {
        return ServiceResponse.failure(BLOCKCHAIN_MESSAGES.NO_BLOCKCHAIN_MESSAGES_FOUND, null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<blockchain[]>(BLOCKCHAIN_MESSAGES.BLOCKCHAIN_FOUND, blockchain);
    } catch (ex) {
      const errorMessage = `Error finding all blockchain: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_WHILE_FETCHING, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const blockchainService = new BlockchainService();
