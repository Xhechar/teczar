import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateServiceRequestDto, FetchServiceRequestDto, UpdateServiceRequestDto } from "../dto/dto.js";
import { ErrorType, SocketTypes } from "../enums/enums.js";
import type { ServiceRequestStatus, User } from "../generated/prisma/browser.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateServiceRequestValidator, UpdateServiceRequestValidator } from "../validators/validators.js";

export class ServiceRequestService extends BaseService implements IService<FetchServiceRequestDto, CreateServiceRequestDto, UpdateServiceRequestDto> {
  async Create(UserId: string, data: CreateServiceRequestDto): Promise<ServiceResult<FetchServiceRequestDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", UserId);

    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.NOTFOUND,
        "You are not allowed to access this service",
      );
    }

    let { error } = CreateServiceRequestValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let create = await prisma.serviceRequest.create({
      data: {
        UserId,
        ...data,
      },
    });

    if (!create) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.SERVER,
        "Unable to book the service at the moment.",
      );
    }

    io.emit(SocketTypes.src);

    return ServiceResponse.Success<FetchServiceRequestDto>(
      "Booking submitted successfully.",
    );
  }
  async Update(id: string, data: UpdateServiceRequestDto): Promise<ServiceResult<FetchServiceRequestDto>> {

    let requestExist = await prisma.serviceRequest.findUnique({
      where: {
        RequestId: id
      }
    });

    if(!requestExist) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(ErrorType.NOTFOUND, "Booking specified not found.")
    }

    let { error } = UpdateServiceRequestValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let update = await prisma.serviceRequest.update({
      data,
      where: {
        RequestId: id
      }
    });

    if (!update) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.SERVER,
        "Unable to book the service at the moment.",
      );
    }

    io.emit(SocketTypes.sru);

    return ServiceResponse.Success<FetchServiceRequestDto>(
      "Booking updated successfully.",
    );
  }
  async Delete(id: string): Promise<ServiceResult<FetchServiceRequestDto>> {
    let requestExist = await prisma.serviceRequest.findUnique({
      where: {
        RequestId: id,
      },
    });

    if (!requestExist) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.NOTFOUND,
        "Booking specified not found.",
      );
    }

    let deleteRequest = await prisma.serviceRequest.delete({
      where: {
        RequestId: id, 
      },
    });

    if (!deleteRequest) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.SERVER,
        "Unable to delete the service at the moment.",
      );
    }

    io.emit(SocketTypes.srd);

    return ServiceResponse.Success<FetchServiceRequestDto>(
      "Booking deleted successfully.",
    );
  }
  async FetchById(id: string): Promise<ServiceResult<FetchServiceRequestDto>> {
    let requestExist = await prisma.serviceRequest.findUnique({
      where: {
        RequestId: id,
      },
      include: {
        Service: true,
        User: true
      }
    });

    if (!requestExist) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.NOTFOUND,
        "Booking specified not found.",
      );
    }

    return ServiceResponse.Success<FetchServiceRequestDto>(
      "Booking fetched successfully.",
      {
        RequestId: requestExist.RequestId,
        Service: {
          ServiceId: requestExist.Service.ServiceId,
          Title: requestExist.Service.Title,
        },
        PreferredDate: requestExist.PreferredDate,
        LocationDescription: requestExist.LocationDescription,
        Status: requestExist.Status,
        CreatedAt: requestExist.CreatedAt,
        User: {
          FirstName: requestExist.User.FirstName,
          SecondName: requestExist.User.SecondName,
          Phone: requestExist.User.Phone,
        },
      },
    );
  }
  async UpdateStatus(id: string, Status: ServiceRequestStatus): Promise<ServiceResult<FetchServiceRequestDto>> {
    let requestExist = await prisma.serviceRequest.findUnique({
      where: {
        RequestId: id,
      },
    });

    if (!requestExist) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.NOTFOUND,
        "Booking specified not found.",
      );
    }

    let update = await prisma.serviceRequest.update({
      data: {
        Status
      },
      where: {
        RequestId: id,
      },
    });

    if (!update) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.SERVER,
        "Unable to book the service at the moment.",
      );
    }

    io.emit(SocketTypes.sru);

    return ServiceResponse.Success<FetchServiceRequestDto>(
      "Booking updated successfully.",
    );
  }
  async FetchAll(): Promise<ServiceResult<FetchServiceRequestDto>> {
    let requestExist = await prisma.serviceRequest.findMany({
      include: {
        Service: true,
        User: true
      },
      orderBy: {
        CreatedAt: "desc"
      }
    });

    if (!requestExist) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.NOTFOUND,
        "Booking specified not found.",
      );
    }

    return ServiceResponse.Success<FetchServiceRequestDto>(
      "Booking fetched successfully.",
      undefined,
      requestExist.map((sr) => ({
        RequestId: sr.RequestId,
        Service: {
          ServiceId: sr.Service.ServiceId,
          Title: sr.Service.Title,
        },
        PreferredDate: sr.PreferredDate,
        LocationDescription: sr.LocationDescription,
        Status: sr.Status,
        CreatedAt: sr.CreatedAt,
        User: {
          FirstName: sr.User.FirstName,
          SecondName: sr.User.SecondName,
          Phone: sr.User.Phone,
        },
      })),
    );
  }
  async FetchByUserId(id: string): Promise<ServiceResult<FetchServiceRequestDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", id);
    
    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.NOTFOUND,
        "You are not allowed to access this service",
      );
    }

    let requestExist = await prisma.serviceRequest.findMany({
      where: {
        UserId: id
      },
      include: {
        Service: true,
        User: true
      },
      orderBy: {
        CreatedAt: "desc",
      },
    });

    if (!requestExist) {
      return ServiceResponse.Failure<FetchServiceRequestDto>(
        ErrorType.NOTFOUND,
        "Booking specified not found.",
      );
    }

    return ServiceResponse.Success<FetchServiceRequestDto>(
      "Booking fetched successfully.",
      undefined,
      requestExist.map((sr) => ({
        RequestId: sr.RequestId,
        Service: {
          ServiceId: sr.Service.ServiceId,
          Title: sr.Service.Title,
        },
        PreferredDate: sr.PreferredDate,
        LocationDescription: sr.LocationDescription,
        Status: sr.Status,
        CreatedAt: sr.CreatedAt,
        User: {
          FirstName: sr.User.FirstName,
          SecondName: sr.User.SecondName,
          Phone: sr.User.Phone,
        },
      })),
    );
  }
  
}