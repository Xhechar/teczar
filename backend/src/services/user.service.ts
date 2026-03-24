import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateUserDto, FetchUserDto, UpdateUserDto } from "../dto/dto.js";
import { ErrorType, SocketTypes, UserRole } from "../enums/enums.js";
import type { User } from "../generated/prisma/client.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateUserValidator, UpdateUserValidator } from "../validators/validators.js";
import bcrypt from 'bcrypt';

export class UserService
  extends BaseService
  implements IService<FetchUserDto, CreateUserDto, UpdateUserDto>
{
  async Create(
    UserId: string,
    data: CreateUserDto,
  ): Promise<ServiceResult<FetchUserDto>> {
    console.log("in service");
    let { error } = CreateUserValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let emailExists = await prisma.user.findUnique({
      where: {
        Email: data.Email,
      },
    });

    if (emailExists) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.NOTFOUND,
        "Email specified already exists, login kindly.",
      );
    }

    let phoneNumber = await prisma.user.findUnique({
      where: {
        Phone: data.Phone,
      },
    });

    if (phoneNumber) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.NOTFOUND,
        "Phone number specified already exists, login kindly.",
      );
    }

    const { Password, ...rest } = data;

    let create = await prisma.user.create({
      data: {
        ...rest,
        PasswordHash: bcrypt.hashSync(Password, 10),
      },
    });

    if (!create) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.SERVER,
        "Unable to create account at the moment.",
      );
    }

    io.emit(SocketTypes.usc);

    return ServiceResponse.Success<FetchUserDto>(
      "Account created successfully, Welcome to Raz Technologies.",
    );
  }
  async Update(
    id: string,
    data: UpdateUserDto,
  ): Promise<ServiceResult<FetchUserDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", id);

    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.NOTFOUND,
        "You are not allowed to access this service",
      );
    }

    let { error } = UpdateUserValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let update = await prisma.user.update({
      data,
      where: {
        UserId: id,
      },
    });

    if (!update) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.SERVER,
        "Unable to update profile at the moment.",
      );
    }

    io.emit(SocketTypes.usu);

    return ServiceResponse.Success<FetchUserDto>(
      "profile updated successfully.",
    );
  }
  async AdminUpdate(
    id: string,
    data: UpdateUserDto,
  ): Promise<ServiceResult<FetchUserDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", id);

    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.NOTFOUND,
        "User specified not found.",
      );
    }

    let { error } = UpdateUserValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let update = await prisma.user.update({
      data,
      where: {
        UserId: id,
      },
    });

    if (!update) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.SERVER,
        "Unable to update user profile at the moment.",
      );
    }

    io.emit(SocketTypes.usu);

    return ServiceResponse.Success<FetchUserDto>(
      "User profile updated successfully.",
    );
  }
  async Delete(id: string): Promise<ServiceResult<FetchUserDto>> {
    let requestExist = await prisma.user.findUnique({
      where: {
        UserId: id,
      },
      include: {
        Orders: true,
        Cart: true,
        ServiceRequests: true,
      },
    });

    if (!requestExist) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.NOTFOUND,
        "user specified not found.",
      );
    }

    if (
      requestExist.Orders.length > 0 &&
      requestExist.ServiceRequests.length > 0
    ) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.VALIDATION,
        "cannot delete user with orders, bookings and / or payments.",
      );
    }

    if(requestExist.Cart) {
      await prisma.cartItem.deleteMany({
        where: {
          CartId: requestExist.Cart.CartId
        }
      });
    }

    io.emit(SocketTypes.usd);

    return ServiceResponse.Success<FetchUserDto>(
      "User profile deleted successfully.",
    );
  }
  async FetchById(id: string): Promise<ServiceResult<FetchUserDto>> {
    let requestExist = await prisma.user.findUnique({
      where: {
        UserId: id,
      },
      include: {
        Orders: true,
        Cart: true,
        ServiceRequests: true,
      },
    });

    if (!requestExist) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.NOTFOUND,
        "user specified not found.",
      );
    }

    return ServiceResponse.Success<FetchUserDto>(
      "profile updated successfully.",
      {
        UserId: requestExist.UserId,
        FirstName: requestExist.FirstName,
        SecondName: requestExist.SecondName,
        Email: requestExist.Email,
        Phone: requestExist.Phone,
        County: requestExist.County,
        LocationDescription: requestExist.LocationDescription as string,
        Role: requestExist.Role as UserRole,
        IsActive: requestExist.IsActive,
        CreatedAt: requestExist.CreatedAt,
      },
    );
  }
  async FetchAll(): Promise<ServiceResult<FetchUserDto>> {
    let requestExist = await prisma.user.findMany({
      include: {
        Orders: true,
        Cart: true,
        ServiceRequests: true,
      },
      orderBy: {
        CreatedAt: "desc",
      },
    });

    if (!requestExist) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.NOTFOUND,
        "user specified not found.",
      );
    }

    return ServiceResponse.Success<FetchUserDto>(
      "profile updated successfully.",
      undefined,
      requestExist.map((u) => ({
        UserId: u.UserId,
        FirstName: u.FirstName,
        SecondName: u.SecondName,
        Email: u.Email,
        Phone: u.Phone,
        County: u.County,
        LocationDescription: u.LocationDescription as string,
        Role: u.Role as UserRole,
        IsActive: u.IsActive,
        CreatedAt: u.CreatedAt,
      })),
    );
  }
  async ToggleActivate(id: string): Promise<ServiceResult<FetchUserDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", id);

    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.NOTFOUND,
        "User specified not found.",
      );
    }

    let update = await prisma.user.update({
      data: {
        IsActive: !(UserExists.Data?.IsActive as boolean),
      },
      where: {
        UserId: id,
      },
    });

    if (!update) {
      return ServiceResponse.Failure<FetchUserDto>(
        ErrorType.SERVER,
        "Unable to update profile at the moment.",
      );
    }

    io.emit(SocketTypes.usu);

    return ServiceResponse.Success<FetchUserDto>(
      "profile updated successfully.",
    );
  }
  async FetchPaged?(
    page: number,
    pageSize: number,
  ): Promise<ServiceResult<FetchUserDto>> {
    throw new Error("Method not implemented.");
  }
  async FetchByStatus?(status: string): Promise<ServiceResult<FetchUserDto>> {
    throw new Error("Method not implemented.");
  }
}