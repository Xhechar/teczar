import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateAdvertDto, FetchAdvertDto, UpdateAdvertDto } from "../dto/dto.js";
import { ErrorType, MediaType, SocketTypes } from "../enums/enums.js";
import type { Advert } from "../generated/prisma/client.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateAdvertValidator, UpdateAdvertValidator } from "../validators/validators.js";

export class AdvertService
  extends BaseService
  implements IService<FetchAdvertDto, CreateAdvertDto, UpdateAdvertDto>
{
  async Create(
    UserId: string,
    data: CreateAdvertDto,
  ): Promise<ServiceResult<FetchAdvertDto>> {
    let { error } = CreateAdvertValidator.validate(data);

    if (error)
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );

    let createAD = await prisma.advert.create({
      data,
    });

    if (!createAD) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.SERVER,
        "Unable to create advert at the moment.",
      );
    }

    io.emit(SocketTypes.adc);

    return ServiceResponse.Success<FetchAdvertDto>(
      "Advert Created Successfully.",
    );
  }
  async Update(
    id: string,
    data: UpdateAdvertDto,
  ): Promise<ServiceResult<FetchAdvertDto>> {
    let adExists = await this.Exists<Advert>(prisma.advert, "AdvertId", id);

    if (!adExists.Success && !adExists.Data) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.NOTFOUND,
        "Advert specified not found.",
      );
    }

    let { error } = UpdateAdvertValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let updateAD = await prisma.advert.update({
      data,
      where: {
        AdvertId: id,
      },
    });

    if (!updateAD) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.SERVER,
        "Unable to update advert at the moment.",
      );
    }

    io.emit(SocketTypes.adu);

    return ServiceResponse.Success<FetchAdvertDto>(
      "Advert updated successfully.",
    );
  }
  async ToggleAdvert(
    id: string,
  ): Promise<ServiceResult<FetchAdvertDto>> {
    let adExists = await prisma.advert.findUnique({
      where: {
        AdvertId: id
      }
    });

    if (!adExists) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.NOTFOUND,
        "Advert specified not found.",
      );
    }

    let updateAD = await prisma.advert.update({
      data: {
        IsActive: !adExists.IsActive
      },
      where: {
        AdvertId: id,
      },
    });

    if (!updateAD) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.SERVER,
        "Unable to update advert at the moment.",
      );
    }

    io.emit(SocketTypes.adu);

    return ServiceResponse.Success<FetchAdvertDto>(
      "Advert updated successfully.",
    );
  }
  async Delete(id: string): Promise<ServiceResult<FetchAdvertDto>> {
    let adExists = await this.Exists<Advert>(prisma.advert, "AdvertId", id);

    if (!adExists.Success && !adExists.Data) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.NOTFOUND,
        "Advert specified not found.",
      );
    }

    let deleteAD = await prisma.advert.delete({
      where: {
        AdvertId: id,
      },
    });

    if (!deleteAD) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.SERVER,
        "Unable to delete advert at the moment.",
      );
    }

    io.emit(SocketTypes.add);

    return ServiceResponse.Success<FetchAdvertDto>(
      "Advert deleted successfully.",
    );
  }
  async FetchById(id: string): Promise<ServiceResult<FetchAdvertDto>> {
    let adExists = await this.Exists<Advert>(prisma.advert, "AdvertId", id);

    if (!adExists) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.NOTFOUND,
        "Advert specified not found.",
      );
    }

    return ServiceResponse.Success<FetchAdvertDto>(
      "Advert fetched successfully.",
      {
        AdvertId: adExists.Data?.AdvertId as string,
        MediaUrl: adExists.Data?.MediaUrl as string,
        MediaType: adExists.Data?.MediaType as MediaType,
        Title: adExists.Data?.Title as string,
        IsActive: adExists.Data?.IsActive as boolean,
      },
    );
  }
  async FetchAll(): Promise<ServiceResult<FetchAdvertDto>> {
    let adExists = await prisma.advert.findMany();

    if (!adExists) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.NOTFOUND,
        "Adverts not found.",
      );
    }

    return ServiceResponse.Success<FetchAdvertDto>(
      "Adverts fetched successfully.",
      undefined,
      adExists.map((a) => ({
        AdvertId: a.AdvertId as string,
        MediaUrl: a.MediaUrl as string,
        MediaType: a.MediaType as MediaType,
        Title: a.Title as string,
        IsActive: a.IsActive as boolean,
      })),
    );
  }
  async FetchActiveAdvert(): Promise<ServiceResult<FetchAdvertDto>> {
    let adExists = await prisma.advert.findMany({
      where: {
        IsActive: true,
      },
    });

    if (!adExists) {
      return ServiceResponse.Failure<FetchAdvertDto>(
        ErrorType.NOTFOUND,
        "Adverts not found.",
      );
    }

    return ServiceResponse.Success<FetchAdvertDto>(
      "Adverts fetched successfully.",
      undefined,
      adExists.map((a) => ({
        AdvertId: a.AdvertId as string,
        MediaUrl: a.MediaUrl as string,
        MediaType: a.MediaType as MediaType,
        Title: a.Title as string,
        IsActive: a.IsActive as boolean,
      })),
    );
  }
}