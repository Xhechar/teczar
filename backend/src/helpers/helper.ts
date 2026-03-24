import { ErrorType } from "../enums/enums.js";

const GetStatusCode = (errorType: ErrorType): number => {
  switch (errorType) {
    case ErrorType.VALIDATION:
      return 400;
    case ErrorType.UNAUTHORIZED:
      return 401;
    case ErrorType.FORBIDDEN:
      return 403;
    case ErrorType.NOTFOUND:
      return 404;
    default:
      return 500;
  }
};
