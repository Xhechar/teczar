import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateProductDto, FetchProductDto, UpdateProductDto } from "../dto/dto.js";
import { ErrorType, SocketTypes } from "../enums/enums.js";
import type { Product } from "../generated/prisma/client.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateProductValidator, UpdateProductValidator } from "../validators/validators.js";

export class ProductService extends BaseService implements IService<Product, CreateProductDto, UpdateProductDto> {
  async Create(UserId: string, data: CreateProductDto): Promise<ServiceResult<Product>> {

    let productExists = await prisma.product.findFirst({
      where: {
        Name: data.Name
      }
    });

    if(productExists) {
      return ServiceResponse.Failure<Product>(ErrorType.VALIDATION, "The product you are creating already exists.");
    }

    let { error } = CreateProductValidator.validate(data);
    
    if (error) {
      return ServiceResponse.Failure<Product>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    if(!data.OfferPrice) {
      delete data.OfferPrice;
    }

    let {ImageUrls, ...rest} = data;

    let create = await prisma.product.create({
      data: {...rest}
    });

    if(!create) {
      return ServiceResponse.Failure<Product>(ErrorType.SERVER, "Unable to create the product at the moment.");
    }

    data.ImageUrls.forEach(async(i) => {
      await prisma.productImage.create({
        data: {
          ProductId: create.ProductId,
          ImageUrl: i
        }
      });
    });

    io.emit(SocketTypes.prc);

    return ServiceResponse.Success<Product>("Product created successfully.");
    
  }
  async Update(id: string, data: UpdateProductDto): Promise<ServiceResult<Product>> {
    
    let productExists = await prisma.product.findUnique({
      where: {
        ProductId: id
      }
    });

    if(!productExists) {
      return ServiceResponse.Failure<Product>(ErrorType.NOTFOUND, "The product specified not found.")
    }

    let {error} = UpdateProductValidator.validate(data);

    if(error) {
      return ServiceResponse.Failure<Product>(ErrorType.VALIDATION, error.details[0]?.message as string);
    }

    if (data.OfferPrice == null) {
      delete data.OfferPrice;
    }

    let updateProduct = await prisma.product.update({
      where: {
        ProductId: id
      },
      data
    });

    if(!updateProduct) {
      return ServiceResponse.Failure<Product>(ErrorType.SERVER, "Unable to update product at the moment.");
    }

    io.emit(SocketTypes.pru)

    return ServiceResponse.Success<Product>("Product updated successfully.");
  }
  async Delete(id: string): Promise<ServiceResult<Product>> {
    let productExists = await prisma.product.findUnique({
      where: {
        ProductId: id,
      },
      include: {
        OrderItems: true
      }
    });

    if (!productExists) {
      return ServiceResponse.Failure<Product>(
        ErrorType.NOTFOUND,
        "The product specified not found.",
      );
    }

    if (productExists.OrderItems.length > 0) {
      return ServiceResponse.Failure<Product>(
        ErrorType.VALIDATION,
        "Cannot delete product with orders.",
      );
    }

    await prisma.productImage.deleteMany({
      where: {
        ProductId: id
      }
    });

    await prisma.cartItem.deleteMany({
      where: {
        ProductId: id,
      },
    });

    let deleteP =await prisma.product.delete({
      where: {
        ProductId: productExists.ProductId
      }
    });

    if (!deleteP) {
      return ServiceResponse.Failure<Product>(
        ErrorType.SERVER,
        "Unable delete product at the moment.",
      );
    }

    io.emit(SocketTypes.prd);

    return ServiceResponse.Success<Product>(
      "Product deleted successfully.",
    );

  }
  async FetchById(id: string): Promise<ServiceResult<Product>> {
    let productExists = await prisma.product.findUnique({
      where: {
        ProductId: id,
      },
      include: {
        Category: true,
        Images: true,
        Reviews: {
          include: {
            User: true
          }
        }
      },
    });

    if (!productExists) {
      return ServiceResponse.Failure<Product>(
        ErrorType.NOTFOUND,
        "The product specified not found.",
      );
    }

    return ServiceResponse.Success<Product>(
      "Product fetched successfully.", productExists
    );
  }
  async FetchAll(): Promise<ServiceResult<Product>> {
    let productExists = await prisma.product.findMany({
      include: {
        Category: true,
        Images: true,
        Reviews: {
          include: {
            User: true,
          },
        },
      },
      orderBy: {
        CreatedAt: "desc"
      }
    });

    if (!productExists) {
      return ServiceResponse.Failure<Product>(
        ErrorType.NOTFOUND,
        "The product(s) specified not found.",
      );
    }

    return ServiceResponse.Success<Product>(
      "Product fetched successfully.",
      undefined,
      productExists,
    );
  }
}