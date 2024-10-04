import type { crossPlatform } from "@/api/crossPlatform/crossPlatform.model";
import { CrossPlatformRepository } from "@/api/crossPlatform/crossPlatform.repository";
import { CROSSPLATFORM_MESSAGES, GLOBAL_MESSAGES } from "@/common/contants";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

export class CrossPlatformService {
  private crossPlatform: CrossPlatformRepository;

  constructor(repository: CrossPlatformRepository = new CrossPlatformRepository()) {
    this.crossPlatform = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<crossPlatform[] | null>> {
    try {
      const crossPlatform = await this.crossPlatform.findAllAsync();
      if (!crossPlatform || crossPlatform.length === 0) {
        return ServiceResponse.failure(CROSSPLATFORM_MESSAGES.NO_PLATFORM_FOUND, null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<crossPlatform[]>(CROSSPLATFORM_MESSAGES.PLATFORM_FOUND, crossPlatform);
    } catch (ex) {
      const errorMessage = `Error finding all crosschain: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_WHILE_FETCHING, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const crossPlatformService = new CrossPlatformService();
