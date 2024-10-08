import type { User } from "@/api/user/user.model";
import { UserRepository } from "@/api/user/user.repository";
import { GLOBAL_MESSAGES, USER_MESSAGES } from "@/common/contants/index";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { cryptoEngine } from "@/common/utils";
import { generateGoogleAuthQRCode, sendPasswordResetEmail } from "@/common/utils/utils.common";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(search?: string): Promise<ServiceResponse<User[] | null>> {
    try {
      const users = await this.userRepository.findAllAsync(search)
      // const users = await this.userRepository.findAllAsync();
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

  async googleAuth(data: any): Promise<ServiceResponse<User[] | null>> {
    try {
      const { email } = data
      const qrCodeUrl: any = await generateGoogleAuthQRCode(email);
      if (!qrCodeUrl) {
        return ServiceResponse.failure(USER_MESSAGES.NO_USER_FOUND, null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<User[]>(USER_MESSAGES.USER_FOUND, qrCodeUrl);
    } catch (ex) {
      const errorMessage = `Error generating QR code: $${(ex as Error).message}`;
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
  // async loginUser({
  //   email,
  //   password,
  // }: { email: string; password: string }): Promise<ServiceResponse<{ accessToken: string } | null>> {
  //   try {
  //     const user = await this.userRepository.findByEmailAsync(email);
  //     if (!user) {
  //       return ServiceResponse.failure(USER_MESSAGES.EMAIL_NOT_EXIST, null, StatusCodes.NOT_FOUND);
  //     }
  //     const isPasswordValid = await cryptoEngine.compare(password, user.password);
  //     if (!isPasswordValid) {
  //       return ServiceResponse.failure(USER_MESSAGES.INCORRECT_PASSWORD, null, StatusCodes.UNAUTHORIZED);
  //     }
  //     const accessToken = cryptoEngine.Jwt.generateJwt({ id: user.id });

  //     return ServiceResponse.success(USER_MESSAGES.LOGIN, { accessToken });
  //   } catch (ex) {
  //     logger.error(`Error logging in: ${(ex as Error).message}`);
  //     return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_USER_LOGIN, null, StatusCodes.INTERNAL_SERVER_ERROR);
  //   }
  // }
  async loginUser({
    email,
    password,
  }: { email: string; password: string }): Promise<ServiceResponse<{ otpSent: boolean } | null>> {
    try {
      const user = await this.userRepository.findByEmailAsync(email);
      if (!user) {
        return ServiceResponse.failure(USER_MESSAGES.EMAIL_NOT_EXIST, null, StatusCodes.NOT_FOUND);
      }

      const isPasswordValid = await cryptoEngine.compare(password, user.password);
      if (!isPasswordValid) {
        return ServiceResponse.failure(USER_MESSAGES.INCORRECT_PASSWORD, null, StatusCodes.UNAUTHORIZED);
      }

      // Send OTP after successful login
      await this.sendAuthOtp({ phone: user.phone, email: user.email, method: 'sms' });

      return ServiceResponse.success(USER_MESSAGES.OTP_SENT, { otpSent: true });
    } catch (ex) {
      logger.error(`Error logging in: ${(ex as Error).message}`);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_USER_LOGIN, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async sendAuthOtp(data: { phone: number; email: string; method: string }): Promise<ServiceResponse<null>> {
    try {
      const { phone, email } = data;
      const user = await this.userRepository.findByEmailAsync(email);
      if (!user) {
        return ServiceResponse.failure(USER_MESSAGES.EMAIL_NOT_EXIST, null, StatusCodes.NOT_FOUND);
      }

      // Static OTP for now
      const otp = '123456';

      // Here, you would send OTP to the user's phone or email
      console.log(`Sending OTP ${otp} to ${phone}`);

      // Optionally save OTP and timestamp in a cache or database for later verification
      // await otpRepository.saveOtp(user.id, otp);

      return ServiceResponse.success(USER_MESSAGES.OTP_SENT, null);
    } catch (ex) {
      logger.error(`Error sending OTP: ${(ex as Error).message}`);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_USER_LOGIN, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyOtp({ email, otp }: { email: string; otp: string }): Promise<ServiceResponse<{ accessToken: string } | null>> {
    try {
      const user = await this.userRepository.findByEmailAsync(email);
      if (!user) {
        return ServiceResponse.failure(USER_MESSAGES.EMAIL_NOT_EXIST, null, StatusCodes.NOT_FOUND);
      }

      // Check if OTP is correct (static '123456' for now)
      if (otp !== '123456') {
        return ServiceResponse.failure(USER_MESSAGES.INVALID_OTP, null, StatusCodes.UNAUTHORIZED);
      }

      // Generate JWT after successful OTP verification
      const accessToken = cryptoEngine.Jwt.generateJwt({ id: user.id });

      return ServiceResponse.success(USER_MESSAGES.LOGIN, { accessToken });
    } catch (ex) {
      logger.error(`Error verifying OTP: ${(ex as Error).message}`);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_USER_LOGIN, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(data: any): Promise<ServiceResponse<null>> {
    try {

      const { id, oldPassword, newPassword, confirmPassword } = data
      const user = await this.userRepository.findUserWithPasswordById(id)
      if (!user) { return ServiceResponse.failure(USER_MESSAGES.NO_USER_FOUND, null, StatusCodes.NOT_FOUND); }
      const isOldPasswordValid = await cryptoEngine.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return ServiceResponse.failure(USER_MESSAGES.INCORRECT_OLD_PASSWORD, null, StatusCodes.UNAUTHORIZED);
      }
      if (newPassword !== confirmPassword) {
        return ServiceResponse.failure(USER_MESSAGES.PASSWORDS_DO_NOT_MATCH, null, StatusCodes.BAD_REQUEST);
      }
      const hashedNewPassword = await cryptoEngine.encrypt(newPassword);
      await this.userRepository.updatePassword(id, hashedNewPassword);
      return ServiceResponse.success(USER_MESSAGES.PASSWORD_CHANGED, null);

    } catch (ex) {
      logger.error(`Error: ${(ex as Error).message}`);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_USER_LOGIN, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }







  /**
   * Creates a new user in the database.
   * @param data - An object containing the user's email and password.
   * @returns A `ServiceResponse` object containing the newly created user or an error message.
   * If the user's email already exists in the database, the `ServiceResponse` will contain a failure message and a status code of 409 (Conflict).
   * If an error occurs while creating the user, the `ServiceResponse` will contain a failure message and a status code of 500 (Internal Server Error).
   */
  // async forgotPassword(data: any): Promise<ServiceResponse<null>> {
  //   try {
  //     const { email } = data;

  //     const user = await this.userRepository.findByEmailAsync(email);
  //     if (!user) {
  //       return ServiceResponse.failure(USER_MESSAGES.EMAIL_NOT_EXIST, null, StatusCodes.NOT_FOUND);
  //     }
  //     const resetToken = cryptoEngine.Jwt.generateJwt({ id: user.id, email: user.email });
  //     await this.userRepository.saveResetToken(user.id, resetToken);
  //     await sendPasswordResetEmail(email, resetToken);

  //     return ServiceResponse.success<null>(USER_MESSAGES.RESET_EMAIL_SENT, null);
  //   } catch (ex) {
  //     const errorMessage = `Error processing forgot password: ${(ex as Error).message}`;
  //     logger.error(errorMessage);
  //     return ServiceResponse.failure(USER_MESSAGES.ERROR_PROCESSING_REQUEST, null, StatusCodes.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async forgotPassword(data: any): Promise<ServiceResponse<null>> {
    try {
      const { email } = data;
      const user = await this.userRepository.findByEmailAsync(email); console.log(user)
      if (!user) {
        return ServiceResponse.failure(USER_MESSAGES.EMAIL_NOT_EXIST, null, StatusCodes.NOT_FOUND);
      }

      // const resetToken = cryptoEngine.generateJwt(); // Use a crypto library to generate the token
      // const tokenExpiry = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour
      // const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      const resetToken = cryptoEngine.Jwt.generateJwt({ id: user.id });

      // Save the token and its expiry to the user's record
      // await this.userRepository.saveResetToken(user.id, resetToken);

      // Send the reset token via email
      await sendPasswordResetEmail(user.email, resetToken);

      return ServiceResponse.success(USER_MESSAGES.RESET_EMAIL_SENT, null);
    } catch (ex) {
      logger.error(`Error sending password reset link: ${(ex as Error).message}`);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_RETRIEVING_USER, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(data: any): Promise<ServiceResponse<null>> {
    try {
      const { token, newPassword } = data
      const verifyJwt: any = cryptoEngine.Jwt.verifyJwt(token);
      console.log(verifyJwt, "YYYYYYYYYYYYYYYYYYY")
      // const user = await this.userRepository.findByResetTokenAsync(token);
      // console.log(user,"USER::::::::::::::============>>>")
      // if (!user) {
      //   return ServiceResponse.failure(USER_MESSAGES.INVALID_TOKEN, null, StatusCodes.UNAUTHORIZED);
      // }

      // if (Date.now() > user.tokenExpiry) {
      //   return ServiceResponse.failure(USER_MESSAGES.RESET_TOKEN_EXPIRED, null, StatusCodes.UNAUTHORIZED);
      // }

      // Hash the new password
      const hashedPassword = await cryptoEngine.encrypt(newPassword);
      console.log(hashedPassword, "hashedPassword::::::::hashedPassword::::::============>>>")

      // Update user's password and clear the reset token
      // await this.userRepository.updatePassword(verifyJwt.userId, hashedPassword);
      // await this.userRepository.clearResetToken(user.id);

      return ServiceResponse.success(USER_MESSAGES.PASSWORD_RESET_SUCCESS, null);
    } catch (ex) {
      logger.error(`Error resetting password: ${(ex as Error).message}`);
      return ServiceResponse.failure(GLOBAL_MESSAGES.ERROR_RETRIEVING_USER, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }



}

export const userService = new UserService();
