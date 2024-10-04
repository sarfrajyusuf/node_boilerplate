import type { ramp } from "@/api/ramp/ramp.model";
import { RampRepository } from "@/api/ramp/ramp.repository";
import { GLOBAL_MESSAGES, RAMP_MESSAGES } from "@/common/contants";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

export class RampService {
  private rampRepository: RampRepository;

  constructor(repository: RampRepository = new RampRepository()) {
    this.rampRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(type?: string | undefined): Promise<ServiceResponse<ramp[] | null>> {
    try {
      console.log("type", type);
      const ramp = type
        ? await this.rampRepository.findAllByType(type)
        : await this.rampRepository.findAllAsync();

      if (!ramp || ramp.length === 0) {
        return ServiceResponse.failure(RAMP_MESSAGES.NO_RAMP_FOUND, null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<ramp[]>(RAMP_MESSAGES.RAMP_FOUND, ramp);
    } catch (ex) {
      const errorMessage = `Error finding all ramps: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_WHILE_FETCHING, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }



}

export const rampService = new RampService();
