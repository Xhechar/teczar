import { prisma } from "../lib/prisma.js";
import lodash from "lodash";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import ejs from "ejs";
import crypto from "crypto";
import type { LoginDto, ResetPasswordDto, ChangePasswordDto, FetchUserDto } from "../dto/dto.js";
import { ErrorType, UserRole } from "../enums/enums.js";
import type { TokenDetails, User } from "../interfaces/interfaces.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { changePasswordSchema, loginSchema, resetPasswordSchema } from "../validators/validators.js";
import { Logger } from "../logs/logger.js";
import { SendMail } from "../emails/config/email.config.js";
import { BaseService } from "../contracts/base.contract.js";

export class AuthService extends BaseService {
  async LoginUser(loginDto: LoginDto): Promise<ServiceResult<object>> {
    let { error } = loginSchema.validate(loginDto);

    if (error) {
      return ServiceResponse.Failure<object>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let EmailExists = await prisma.user.findUnique({
      where: {
        Email: loginDto.Email,
      },
    });

    if (!EmailExists) {
      return ServiceResponse.Failure<object>(
        ErrorType.NOTFOUND,
        "Email provided not found. Kindly register instead.",
      );
    }

    if (!EmailExists.IsActive) {
      return ServiceResponse.Failure<object>(
        ErrorType.NOTFOUND,
        "Your account has been supended, kindly contact system admin.",
      );
    }

    let PasswordMatches = bcrypt.compareSync(
      loginDto.Password,
      EmailExists.PasswordHash,
    );

    if (!PasswordMatches) {
      return ServiceResponse.Failure<object>(
        ErrorType.VALIDATION,
        "Incorrect password provided",
      );
    }

    let AccessToken: string = jwt.sign(
      {
        UserId: EmailExists.UserId,
        Email: EmailExists.Email,
        Role: EmailExists.Role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "15m",
      },
    );

    let RefreshToken: string = jwt.sign(
      {
        UserId: EmailExists.UserId,
        Email: EmailExists.Email,
        Role: EmailExists.Role,
      },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: "1d",
      },
    );

    let refreshExists = await prisma.refreshToken.findFirst({
      where: {
        UserId: EmailExists.UserId,
      },
    });

    if (refreshExists) {
      let saveRefresh = await prisma.refreshToken.update({
        where: {
          RefreshTokenId: refreshExists.RefreshTokenId,
        },
        data: {
          TokenHash: crypto
            .createHash("sha256")
            .update(RefreshToken)
            .digest("hex"),
        },
      });

      if (!saveRefresh){
        return ServiceResponse.Failure<object>(
          ErrorType.SERVER,
          "An error occured during login, kindly try again later.",
        );
      }
        
      return ServiceResponse.AuthSuccess<object>(
        AccessToken,
        RefreshToken,
        EmailExists.Role as UserRole,
      );
    }

    let saveRefresh = await prisma.refreshToken.create({
      data: {
        RefreshTokenId: v4(),
        UserId: EmailExists.UserId,
        TokenHash: crypto
          .createHash("sha256")
          .update(RefreshToken)
          .digest("hex"),
      },
    });

    if (lodash.isEmpty(saveRefresh))
      return ServiceResponse.Failure<object>(
        ErrorType.SERVER,
        "An error occured during login, kindly try again later.",
      );

    return ServiceResponse.AuthSuccess<object>(
      AccessToken,
      RefreshToken,
      EmailExists.Role as UserRole,
    );
  }

  async RefreshToken(RefreshToken: string): Promise<ServiceResult<object>> {
    let UserData: TokenDetails;

    try {
      UserData = jwt.verify(
        RefreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as TokenDetails;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return ServiceResponse.Failure(
          ErrorType.UNAUTHORIZED,
          "Authentication expired",
        );
      }

      return ServiceResponse.Failure(
        ErrorType.UNAUTHORIZED,
        "Invalid authentication",
      );
    }

    if (!UserData) {
      return ServiceResponse.Failure(
        ErrorType.UNAUTHORIZED,
        "access is unauthorized, login instead.",
      );
    }

    let verifyUser = await prisma.refreshToken.findFirst({
      where: {
        UserId: UserData.UserId,
        TokenHash: crypto
          .createHash("sha256")
          .update(RefreshToken)
          .digest("hex"),
      },
    });

    if (!verifyUser)
      return ServiceResponse.Failure<object>(
        ErrorType.UNAUTHORIZED,
        "Credentials provided are invalid.",
      );

    const { iat, exp, ...payload } = UserData;

    let AccessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });

    let refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "1d" },
    );

    await prisma.refreshToken.update({
      data: {
        TokenHash: crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex"),
      },
      where: {
        RefreshTokenId: verifyUser.RefreshTokenId,
        UserId: (UserData as TokenDetails).UserId,
      },
    });

    return ServiceResponse.AuthSuccess(
      AccessToken,
      refreshToken,
      (UserData as TokenDetails).Role,
    );
  }

  async VerifyMail(Email: string): Promise<ServiceResult<object>> {
    let EmailExists = await prisma.user.findUnique({
      where: {
        Email,
      },
    });

    if (lodash.isEmpty(EmailExists)) {
      return ServiceResponse.Failure(
        ErrorType.NOTFOUND,
        "Email provided, is not found kindly sign up.",
      );
    }

    if (EmailExists.IsDeleted) {
      return ServiceResponse.Failure<object>(
        ErrorType.NOTFOUND,
        "Your account has been supended, kindly contact system admin.",
      );
    }

    let recovery = await prisma.recovery.create({
      data: {
        RecoveryCode: String(Math.floor(100000 + Math.random() * 900000)),
        Expiry: new Date(new Date().getTime() + 60 * 60 * 1000),
        Email: EmailExists.Email
      },
    });

    if (lodash.isEmpty(recovery)) {
      return ServiceResponse.Failure(
        ErrorType.SERVER,
        "Unable to handle email verification at the moment.",
      );
    }

    await ejs.renderFile(
      "templates/verify_mail.ejs",
      { emailExists: EmailExists, recovery },
      async (err, data) => {
        if (err) {
          Logger.error(err.message);
        }

        await SendMail({
          from: process.env.EMAIL as string,
          to: EmailExists.Email,
          subject: "Raz Technologies | Password Verification",
          html: data,
        });
      },
    );

    return ServiceResponse.Success("Verification code sent to your email.");
  }

  async ResetPassword(
    resetPassword: ResetPasswordDto,
  ): Promise<ServiceResult<object>> {
    let { error } = resetPasswordSchema.validate(resetPassword);

    if (error) {
      return ServiceResponse.Failure(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let UserExists = await prisma.user.findUnique({
      where: {
        Email: resetPassword.Email,
      },
    });

    if (lodash.isEmpty(UserExists))
      return ServiceResponse.Failure<object>(
        ErrorType.NOTFOUND,
        "email provided not found, kindly register an account.",
      );

    let RecoveryExists = await prisma.recovery.findMany({
      where: {
        Email: UserExists.Email,
        RecoveryCode: String(resetPassword.ResetCode),
        IsUsed: false,
        Expiry: {
          gt: new Date(),
        },
      },
      orderBy: {
        CreatedAt: "desc",
      },
    });

    if (!RecoveryExists && RecoveryExists[0])
      return ServiceResponse.Failure<object>(
        ErrorType.NOTFOUND,
        "Invalid or expired verification code provided.",
      );

    let UpdatePassword = await prisma.user.update({
      where: {
        UserId: UserExists.UserId,
      },
      data: {
        PasswordHash: bcrypt.hashSync(resetPassword.NewPassword, 10),
      },
    });

    if (!UpdatePassword)
      return ServiceResponse.Failure<object>(
        ErrorType.SERVER,
        "Unable to change password at the moment.",
      );

    await prisma.recovery.update({
      where: {
        RecoveryId: RecoveryExists[0]?.RecoveryId as string,
      },
      data: {
        IsUsed: true,
      },
    });

    return ServiceResponse.Success<object>("Password reset successfully.");
  }

  async ChangePassword(
    UserId: string,
    changePassword: ChangePasswordDto,
  ): Promise<ServiceResult<object>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", UserId);
        
    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<object>(
        ErrorType.NOTFOUND,
        "You are not allowed to access this service",
      );
    }

    let { error } = changePasswordSchema.validate(changePassword);

    if (error) {
      return ServiceResponse.Failure(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let PasswordMatches = bcrypt.compareSync(
      changePassword.OldPassword,
      (UserExists.Data)?.PasswordHash as string,
    );

    if (!PasswordMatches)
      return ServiceResponse.Failure<object>(
        ErrorType.BADREQUEST,
        "Incorrect password provided.",
      );

    let updateUser = prisma.user.update({
      where: {
        UserId: (UserExists.Data as User).UserId,
      },
      data: {
        PasswordHash: bcrypt.hashSync(changePassword.NewPassword, 10),
      },
    });

    if (!updateUser)
      return ServiceResponse.Failure<object>(
        ErrorType.SERVER,
        "Unable to change password at the moment.",
      );

    return ServiceResponse.Success<object>("Password reset successfully.");
  }

  async LogoutUser(UserId: string): Promise<ServiceResult<object>> {
    throw new Error("Method not implemented.");
  }

  async IsAuthenticated(UserId: string): Promise<ServiceResult<FetchUserDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", UserId);
        
    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.NOTFOUND,
        "You are not allowed to access this service",
      );
    }

    let returnedUser: FetchUserDto = {
      UserId: (UserExists.Data as User).UserId,
      FirstName: (UserExists.Data as User).FirstName,
      SecondName: (UserExists.Data as User).SecondName,
      Email: (UserExists.Data as User).Email,
      Phone: (UserExists.Data as User).Phone,
      County: (UserExists.Data as User).County,
      LocationDescription: (UserExists.Data as User).LocationDescription as string,
      Role: (UserExists.Data as User).Role,
      IsActive: (UserExists.Data as User).IsActive,
      CreatedAt: (UserExists.Data as User).CreatedAt,
    };

    return ServiceResponse.Success<FetchUserDto>(
      "Authentication successful.",
      returnedUser,
      undefined,
      (UserExists.Data as User).Role as UserRole,
    );
  }
}