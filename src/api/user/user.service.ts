import type { User } from "@/api/user/user.model";
import { UserRepository } from "@/api/user/user.repository";
import { GLOBAL_MESSAGES, USER_MESSAGES } from "@/common/contants/index";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { cryptoEngine } from "@/common/utils";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<User[] | null>> {
    try {
      const users = await this.userRepository.findAllAsync();
      if (!users || users.length === 0) {
        return ServiceResponse.failure(USER_MESSAGES.NO_USER_FOUND, null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<User[]>(USER_MESSAGES.USER_FOUND, users);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_RETRIEVING_USER, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves a single user by their ID.
   * @param id - The unique identifier of the user to retrieve.
   * @returns A `ServiceResponse` object containing the logged-in user or an error message.
   * If the user is found, the `ServiceResponse` will contain the user object and a success message.
   * If the user is not found, the `ServiceResponse` will contain a failure message and a status code of 404 (Not Found).
   * If an error occurs while retrieving the user, the `ServiceResponse` will contain a failure message and a status code of 500 (Internal Server Error).
   */
  async findById(id: number): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure(USER_MESSAGES.NO_USER_FOUND, null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<User>(USER_MESSAGES.USER_FOUND, user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_RETRIEVING_USER, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Creates a new user in the database.
   * @param data - An object containing the user's email and password.
   * @returns A `ServiceResponse` object containing the newly created user or an error message.
   * If the user's email already exists in the database, the `ServiceResponse` will contain a failure message and a status code of 409 (Conflict).
   * If an error occurs while creating the user, the `ServiceResponse` will contain a failure message and a status code of 500 (Internal Server Error).
   */
  async create(data: any): Promise<ServiceResponse<User | null>> {
    try {
      const { email, password } = data;
      if ((await this.userRepository.findByEmailAsync(email))) {
        return ServiceResponse.failure(USER_MESSAGES.EMAI_EXIST, null, StatusCodes.NOT_FOUND);
      }
      data.password = await cryptoEngine.encrypt(password);
      const user = await this.userRepository.create(data);
      if (!user) {
        return ServiceResponse.failure(USER_MESSAGES.ERROR_TO_CREATE_USER, null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<User>(USER_MESSAGES.USER_CREATED, user);
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_RETRIEVING_USER, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Logs in a user by validating their email and password.
   * @param data - An object containing the user's email and password.
   * @returns A `ServiceResponse` object containing the logged-in user or an error message.
   * @throws An error if the user's email does not exist or if the password is incorrect.
   */
  async loginUser({
    email,
    password,
  }: { email: string; password: string }): Promise<ServiceResponse<{ accessToken: string } | null>> {
    try {
      const user = await this.userRepository.findByEmailAsync(email);
      if (!user) {
        return ServiceResponse.failure(USER_MESSAGES.EMAIL_NOT_EXIST, null, StatusCodes.NOT_FOUND);
      }
      const isPasswordValid = await cryptoEngine.compare(password, user.password);
      if (!isPasswordValid) {
        return ServiceResponse.failure(USER_MESSAGES.INCORRECT_PASSWORD, null, StatusCodes.UNAUTHORIZED);
      }
      const accessToken = cryptoEngine.Jwt.generateJwt({ id: user.id });

      return ServiceResponse.success(USER_MESSAGES.LOGIN, { accessToken });
    } catch (ex) {
      logger.error(`Error logging in: ${(ex as Error).message}`);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_USER_LOGIN, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userService = new UserService();
