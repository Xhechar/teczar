import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateServiceDto, FetchServiceDto, UpdateServiceDto } from "../dto/dto.js";
import { ErrorType, SocketTypes } from "../enums/enums.js";
import type { User } from "../interfaces/interfaces.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateServiceValidator } from "../validators/validators.js";

export class ServicesService extends BaseService implements IService<FetchServiceDto, CreateServiceDto, UpdateServiceDto> {
  async Create(UserId: string, data: CreateServiceDto): Promise<ServiceResult<FetchServiceDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", UserId);

    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<FetchServiceDto>(
        ErrorType.NOTFOUND,
        "You are not allowed to access this service",
      );
    }

    let { error } = CreateServiceValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchServiceDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let create = await prisma.service.create({
      data
    });

    if (!create) {
      return ServiceResponse.Failure<FetchServiceDto>(
        ErrorType.SERVER,
        "Unable to create service at the moment.",
      );
    }

    io.emit(SocketTypes.sec);

    return ServiceResponse.Success<FetchServiceDto>(
      "Service  created successfully.",
    );
  }
  async Update(id: string, data: UpdateServiceDto): Promise<ServiceResult<FetchServiceDto>> {

    let requestExist = await prisma.service.findUnique({
      where: {
        ServiceId: id
      }
    });

    if(!requestExist) {
      return ServiceResponse.Failure<FetchServiceDto>(ErrorType.NOTFOUND, "Service specified not found.")
    }
    
    let { error } = CreateServiceValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchServiceDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let update = await prisma.service.update({
      data,
      where: {
        ServiceId: id
      }
    });

    if (!update) {
      return ServiceResponse.Failure<FetchServiceDto>(
        ErrorType.SERVER,
        "Unable to update service at the moment.",
      );
    }

    io.emit(SocketTypes.seu);

    return ServiceResponse.Success<FetchServiceDto>(
      "Service  created successfully.",
    );
  }
  async Delete(id: string): Promise<ServiceResult<FetchServiceDto>> {
    
    let requestExist = await prisma.service.findUnique({
      where: {
        ServiceId: id,
      },
      include: {
        Requests: true
      }
    });

    if (!requestExist) {
      return ServiceResponse.Failure<FetchServiceDto>(
        ErrorType.NOTFOUND,
        "Service specified not found.",
      );
    }

    if (requestExist.Requests.length > 0) {
      return ServiceResponse.Failure<FetchServiceDto>(
        ErrorType.NOTFOUND,
        "Cannot delete service containing bookings.",
      );
    }

    let deleteService = await prisma.service.delete({
      where: {
        ServiceId: id,
      },
    });

    if (!deleteService) {
      return ServiceResponse.Failure<FetchServiceDto>(
        ErrorType.SERVER,
        "Unable to delete service at the moment.",
      );
    }

    io.emit(SocketTypes.sed);

    return ServiceResponse.Success<FetchServiceDto>(
      "Service  deleted successfully.",
    );
  }
  async FetchById(id: string): Promise<ServiceResult<FetchServiceDto>> {
    let serviceExist = await prisma.service.findUnique({
      where: {
        ServiceId: id,
      },
      include: {
        Requests: true,
      },
    });

    if (!serviceExist) {
      return ServiceResponse.Failure<FetchServiceDto>(
        ErrorType.NOTFOUND,
        "Service specified not found.",
      );
    }

    return ServiceResponse.Success<FetchServiceDto>(
      "Service  fetched successfully.",
      {
        ServiceId: serviceExist.ServiceId,
        Title: serviceExist.Title,
        Description: serviceExist.Description,
        ImageUrl: serviceExist.ImageUrl,
        OnOffer: serviceExist.OnOffer,
        IsFeatured: serviceExist.IsFeatured
      }
    );
  }
  async FetchAll(): Promise<ServiceResult<FetchServiceDto>> {
    
    let serviceExist = await prisma.service.findMany({
      include: {
        Requests: true,
      },
      orderBy: {
        CreatedAt: "desc"
      }
    });

    if (!serviceExist) {
      return ServiceResponse.Failure<FetchServiceDto>(
        ErrorType.NOTFOUND,
        "Service specified not found.",
      );
    }

    return ServiceResponse.Success<FetchServiceDto>(
      "Service  fetched successfully.",
      undefined,
      serviceExist.map((s) => ({
        ServiceId: s.ServiceId,
        Title: s.Title,
        Description: s.Description,
        ImageUrl: s.ImageUrl,
        OnOffer: s.OnOffer,
        IsFeatured: s.IsFeatured,
      })),
    );
  }
  
}