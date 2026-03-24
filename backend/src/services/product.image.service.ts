import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateProductImageDto, FetchProductImageDto, UpdateProductImageDto } from "../dto/dto.js";
import { ErrorType, SocketTypes } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateProductImageValidator, UpdateProductImageValidator } from "../validators/validators.js";

export class ProductImageService extends BaseService implements IService<FetchProductImageDto, CreateProductImageDto, UpdateProductImageDto> {
  async Create(UserId: string, data: CreateProductImageDto): Promise<ServiceResult<FetchProductImageDto>> {
    
    let productExists = await prisma.product.findUnique({
      where: {
        ProductId: data.ProductId,
      },
    });

    if (!productExists) {
      return ServiceResponse.Failure<FetchProductImageDto>(
        ErrorType.NOTFOUND,
        "The product specified not found.",
      );
    }

    let { error } = CreateProductImageValidator.validate(data);
    
    if (error) {
      return ServiceResponse.Failure<FetchProductImageDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let create = await prisma.productImage.create({
      data
    });

    if (!create) {
      return ServiceResponse.Failure<FetchProductImageDto>(
        ErrorType.SERVER,
        "Unable to create the product image at the moment.",
      );
    }

    io.emit(SocketTypes.pru);

    return ServiceResponse.Success<FetchProductImageDto>(
      "Product image created successfully.",
    );
  }
  async Update(id: string, data: UpdateProductImageDto): Promise<ServiceResult<FetchProductImageDto>> {
    let productExists = await prisma.productImage.findUnique({
      where: {
        ImageId: id,
      },
    });

    if (!productExists) {
      return ServiceResponse.Failure<FetchProductImageDto>(
        ErrorType.NOTFOUND,
        "The product image specified not found.",
      );
    }

    let { error } = UpdateProductImageValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchProductImageDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let update = await prisma.productImage.update({
      data,
      where: {
        ImageId: productExists.ImageId
      }
    });

    if (!update) {
      return ServiceResponse.Failure<FetchProductImageDto>(
        ErrorType.SERVER,
        "Unable to update the product image at the moment.",
      );
    }

    io.emit(SocketTypes.pru);

    return ServiceResponse.Success<FetchProductImageDto>(
      "Product image updated successfully.",
    );
  }
  async Delete(id: string): Promise<ServiceResult<FetchProductImageDto>> {
    
    let productExists = await prisma.productImage.findUnique({
      where: {
        ImageId: id,
      },
    });

    if (!productExists) {
      return ServiceResponse.Failure<FetchProductImageDto>(
        ErrorType.NOTFOUND,
        "The product image specified not found.",
      );
    }

    let deleteImage = await prisma.productImage.delete({
      where: {
        ImageId: productExists.ImageId,
      },
    });

    if (!deleteImage) {
      return ServiceResponse.Failure<FetchProductImageDto>(
        ErrorType.SERVER,
        "Unable to delete the product image at the moment.",
      );
    }

    io.emit(SocketTypes.pru);

    return ServiceResponse.Success<FetchProductImageDto>(
      "Product image deleted successfully.",
    );
  }  
}