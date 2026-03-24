import type { ErrorType, UserRole } from "../../enums/enums.js";
import type { ServiceResult } from "../result/service.result.js";

export class ServiceResponse<T> {
  static Success<T>(
    SuccessMessage: string,
    Data?: T,
    DataList?: T[],
    Role?: UserRole,
  ): ServiceResult<T> {
    return {
      Success: true,
      Title: "Success",
      SuccessMessage,
      Data,
      DataList,
      Role,
    };
  }

  static Failure<T>(Title: ErrorType, ErrorMessage: string): ServiceResult<T> {
    return {
      Success: false,
      Title,
      ErrorMessage,
    };
  }

  static AuthSuccess<T>(
    AccessToken: string,
    RefreshToken: string,
    Role: UserRole,
    Data?: T,
  ): ServiceResult<T> {
    return {
      Success: true,
      Title: "Auth Success",
      SuccessMessage: "login successful",
      AccessToken,
      RefreshToken,
      Role,
      Data,
    };
  }
}