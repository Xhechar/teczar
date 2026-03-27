import type { Request, Response } from "express";
import { ErrorType } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import { GetUserIdFromToken } from "../middleware/middleware.js";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  private authService: AuthService = new AuthService();

  async LoginUser(Req: Request, Res: Response) {
    try {
      let result = await this.authService.LoginUser(Req.body);
      
      if (result.Success) {
        Res.cookie("accessToken", result.AccessToken as string, {
          signed: true,
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
        });

        Res.cookie("refreshToken", result.RefreshToken as string, {
          httpOnly: true,
          signed: true,
          sameSite: "none",
          path: "/",
          secure: true,
        });

        return Res.status(200).json(
          ServiceResponse.Success(
            result.SuccessMessage as string,
            undefined,
            undefined,
            result.Role,
          ),
        );
      }

      return Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<object>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An error has occured, try again later.",
        ),
      );
    }
  }

  async RefreshToken(Req: Request, Res: Response) {
    try {
      let result = await this.authService.RefreshToken(
        Req.signedCookies.refreshToken,
      );

      if (result.Success) {
        Res.cookie("accessToken", result.AccessToken as string, {
          signed: true,
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
        });

        Res.cookie("refreshToken", result.RefreshToken as string, {
          httpOnly: true,
          signed: true,
          sameSite: "none",
          path: "/",
          secure: true,
        });

        return Res.status(200).json(
          ServiceResponse.Success(
            result.SuccessMessage as string,
            undefined,
            undefined,
            result.Role,
          ),
        );
      }

      return Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<object>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An error has occured, try again later.",
        ),
      );
    }
  }

  async VerifyMail(Req: Request, Res: Response) {
    try {
      let result = await this.authService.VerifyMail(Req.body.Email);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<object>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An error has occured, try again later.",
        ),
      );
    }
  }
  async ResetPassword(Req: Request, Res: Response) {
    try {
      let result = await this.authService.ResetPassword(Req.body);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<object>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An error has occured, try again later.",
        ),
      );
    }
  }
  async ChangePassword(Req: Request, Res: Response) {
    try {
      let result = await this.authService.ChangePassword(
        GetUserIdFromToken(Req),
        Req.body,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<object>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An error has occured, try again later.",
        ),
      );
    }
  }
  async LogoutUser(Req: Request, Res: Response) {
    try {
      Res.clearCookie("accessToken", {
        signed: true,
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      });

      Res.clearCookie("refreshToken", {
        signed: true,
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      });

      return Res.status(200).json(
        ServiceResponse.Success<object>("Logout successful! Always welcomed."),
      );
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<object>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An error has occured, try again later.",
        ),
      );
    }
  }
  async IsAuthenticated(Req: Request, Res: Response) {
    try {
      let result = await this.authService.IsAuthenticated(
        GetUserIdFromToken(Req),
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<object>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An error has occured, try again later.",
        ),
      );
    }
  }
}