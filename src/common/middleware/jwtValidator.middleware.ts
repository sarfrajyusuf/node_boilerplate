import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "../models/serviceResponse";
import { cryptoEngine, handleServiceResponse } from "../utils";

export const validateJwtToken = (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.headers["api-access-token"];
  if (!token) {
    return res.status(401).json({ message: "Access token is missing or invalid" });
  }
  const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload;

  if (!decoded || !decoded.header || !decoded.payload) {
    const failure = ServiceResponse.failure("JWT verification failed: invalid token", null, StatusCodes.BAD_REQUEST);
    handleServiceResponse(failure, res);
  }
  const { exp } = decoded.payload;

  // Check if the token is expired
  if (exp && Date.now() >= exp * 1000) {
    const failure = ServiceResponse.failure("JWT token is expired", null, StatusCodes.GONE);
    handleServiceResponse(failure, res);
  }

  const verified: any = cryptoEngine.Jwt.verifyJwt(token);
  if (verified) {
    const { data } = verified;
    const decoded = cryptoEngine.Jwt.decodeJwt(data);
    console.log("decoded", decoded);
    next();
  } else {
    const failure = ServiceResponse.failure("JWT verification failed: invalid token", null, StatusCodes.BAD_REQUEST);
    handleServiceResponse(failure, res);
  }
};

export default validateJwtToken;
