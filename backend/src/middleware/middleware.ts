import { ErrorType, UserRole } from "../enums/enums.js";
import type { TokenDetails } from "../interfaces/interfaces.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface ExtendedRequest extends Request {
  TokenDetails?: TokenDetails;
}

export const VerifyToken = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req.signedCookies.accessToken;

    if (!token) {
      return res
        .status(401)
        .json(
          ServiceResponse.Failure<object>(
            ErrorType.UNAUTHORIZED,
            "Authentication token is required",
          ),
        );
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res
              .status(401)
              .json(
                ServiceResponse.Failure<object>(
                  ErrorType.UNAUTHORIZED,
                  "Authentication expired",
                ),
              );
          } else if (err.name === "JsonWebTokenError") {
            return res
              .status(401)
              .json(
                ServiceResponse.Failure<object>(
                  ErrorType.UNAUTHORIZED,
                  "Invalid authentication",
                ),
              );
          } else {
            return res
              .status(401)
              .json(
                ServiceResponse.Failure<object>(
                  ErrorType.UNAUTHORIZED,
                  "Unable to authenticate user",
                ),
              );
          }
        }

        req.TokenDetails = decoded as TokenDetails;
        next();
      },
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        ServiceResponse.Failure(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An error occurred while verifying authentication",
        ),
      );
  }
};

export const GetUserIdFromToken = (req: ExtendedRequest): string => {
  let data: TokenDetails = req.TokenDetails as TokenDetails;

  return !data || !data.UserId ? "" : data.UserId;
};

export const verifyAdmin = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  let data: TokenDetails = req.TokenDetails as TokenDetails;

  if (!data)
    return res
      .status(403)
      .json(
        ServiceResponse.Failure<object>(
          ErrorType.UNAUTHORIZED,
          "Authentication token is missing",
        ),
      );

  if (data.Role !== UserRole.Admin) {
    return res
      .status(403)
      .json(
        ServiceResponse.Failure<object>(
          ErrorType.UNAUTHORIZED,
          "Access denied. Admins only.",
        ),
      );
  }

  next();
};

export const verifyUser = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  let data: TokenDetails = req.TokenDetails as TokenDetails;

  if (!data)
    return res
      .status(403)
      .json(
        ServiceResponse.Failure<object>(
          ErrorType.UNAUTHORIZED,
          "Authentication token is missing",
        ),
      );

  if (data.Role !== UserRole.Customer) {
    return res
      .status(403)
      .json(
        ServiceResponse.Failure<object>(
          ErrorType.UNAUTHORIZED,
          "Access denied. Users only.",
        ),
      );
  }

  next();
};