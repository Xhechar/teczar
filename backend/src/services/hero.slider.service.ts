import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateHeroSlideDto, UpdateHeroSlideDto } from "../dto/dto.js";
import { ErrorType, SocketTypes } from "../enums/enums.js";
import type { HeroSlide } from "../interfaces/interfaces.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { createHeroSlideSchema, updateHeroSlideSchema } from "../validators/validators.js";

export class HeroSliderService
  extends BaseService
  implements IService<HeroSlide, CreateHeroSlideDto, UpdateHeroSlideDto>
{
  async Create(
    UserId: string,
    data: CreateHeroSlideDto,
  ): Promise<ServiceResult<HeroSlide>> {
    let { error } = createHeroSlideSchema.validate(data);
        
    if (error) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let createSlide = await prisma.heroSlide.create({
      data,
    });

    if (!createSlide) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.SERVER,
        "Unable to create slide at the moment.",
      );
    }

    io.emit(SocketTypes.hsc);

    return ServiceResponse.Success<HeroSlide>(
      "Slide created successfully.",
    );
  }
  async Update(
    id: string,
    data: Partial<CreateHeroSlideDto>,
  ): Promise<ServiceResult<HeroSlide>> {

    let slideExists = await prisma.heroSlide.findUnique({
      where: {
        SlideId: id
      }
    });

    if (!slideExists) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.NOTFOUND,
        "Slide specified not found.",
      );
    }

    let { error } = updateHeroSlideSchema.validate(data);

    if (error) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let updateSlide = await prisma.heroSlide.update({
      data,
      where: {
        SlideId: slideExists.SlideId
      }
    });

    if (!updateSlide) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.SERVER,
        "Unable to update slide at the moment.",
      );
    }

    io.emit(SocketTypes.hsu);

    return ServiceResponse.Success<HeroSlide>("Slide updated successfully.");
  }
  async Delete(id: string): Promise<ServiceResult<HeroSlide>> {
    let slideExists = await prisma.heroSlide.findUnique({
      where: {
        SlideId: id
      }
    });

    if (!slideExists) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.NOTFOUND,
        "Slide specified not found.",
      );
    }

    let deleteSlide = await prisma.heroSlide.delete({
      where: {
        SlideId: slideExists.SlideId
      }
    });

    if (!deleteSlide) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.SERVER,
        "Unable to delete slide at the moment.",
      );
    }

    io.emit(SocketTypes.hsd);

    return ServiceResponse.Success<HeroSlide>("Slide deleted successfully.");
  }
  async ToggleActive(id: string): Promise<ServiceResult<HeroSlide>> {
    let slideExists = await prisma.heroSlide.findUnique({
      where: {
        SlideId: id
      }
    });

    if (!slideExists) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.NOTFOUND,
        "Slide specified not found.",
      );
    }

    let updateSlide = await prisma.heroSlide.update({
      data: {
        IsActive: !slideExists.IsActive
      },
      where: {
        SlideId: slideExists.SlideId
      }
    });

    if (!updateSlide) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.SERVER,
        "Unable to update slide at the moment.",
      );
    }

    io.emit(SocketTypes.hsu);

    return ServiceResponse.Success<HeroSlide>("Slide updated successfully.");
  }
  async FetchAll(): Promise<ServiceResult<HeroSlide>> {
    let slideExists = await prisma.heroSlide.findMany();

    if (!slideExists) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.NOTFOUND,
        "Slide specified not found.",
      );
    }

    return ServiceResponse.Success<HeroSlide>("Slide updated successfully.", undefined, slideExists);
  }
  async FetchActive(): Promise<ServiceResult<HeroSlide>> {
    let slideExists = await prisma.heroSlide.findMany({
      where: {
        IsActive: true
      }
    });

    if (!slideExists) {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.NOTFOUND,
        "Slide specified not found.",
      );
    }

    return ServiceResponse.Success<HeroSlide>(
      "Slide updated successfully.",
      undefined,
      slideExists,
    );
  }

  async HandleReorder(ids: string[]): Promise<ServiceResult<HeroSlide>> {
    try {
      const updatePromises = ids.map((id, index) =>
        prisma.heroSlide.update({
          where: { SlideId: id },
          data: { SortOrder: index },
        })
      );

      await Promise.all(updatePromises);

      io.emit(SocketTypes.hsu);

      return ServiceResponse.Success<HeroSlide>("Slides reordered successfully.");
    } catch {
      return ServiceResponse.Failure<HeroSlide>(
        ErrorType.SERVER,
        "Unable to reorder slides at the moment.",
      );
    }
  }
}