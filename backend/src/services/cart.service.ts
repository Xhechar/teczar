import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateCartItemDto, FetchCartDto, UpdateCartItemDto } from "../dto/dto.js";
import { ErrorType } from "../enums/enums.js";
import type { User } from "../generated/prisma/client.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";

export class CartService
  extends BaseService
  implements IService<FetchCartDto, CreateCartItemDto, UpdateCartItemDto>
{
  async FetchByUserId(id: string): Promise<ServiceResult<FetchCartDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", id);

    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.NOTFOUND,
        "You are not allowed to access this service",
      );
    }

    let fetchCart = await prisma.cart.findFirst({
      where: {
        UserId: id,
      },
      include: {
        Items: {
          include: {
            Product: {
              include: {
                Images: true,
                Category: true
              },
            },
          },
        },
      },
    });

    if (!fetchCart) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.NOTFOUND,
        "You have no cart at the moment.",
      );
    }

    return ServiceResponse.Success<FetchCartDto>("Cart fetched successfully.", {
      CartId: fetchCart.CartId,
      Items: fetchCart.Items.map((i) => ({
        CartItemId: i.CartItemId,
        ProductId: i.ProductId,
        Name: i.Product.Name,
        Price: i.Product.Price.toNumber(),
        Quantity: i.Quantity,
        Image: i.Product.Images[0]?.ImageUrl as string,
        Category: i.Product.Category.Name
      })),
    });
  }
  async FetchAll?(): Promise<ServiceResult<FetchCartDto>> {
    throw new Error("Method not implemented.");
  }
  Create(
    UserId: string,
    data: CreateCartItemDto,
  ): Promise<ServiceResult<FetchCartDto>> {
    throw new Error("Method not implemented.");
  }
  Update(
    id: string,
    data: UpdateCartItemDto,
    UserId?: string,
  ): Promise<ServiceResult<FetchCartDto>> {
    throw new Error("Method not implemented.");
  }
  Delete(id: string, UserId?: string): Promise<ServiceResult<FetchCartDto>> {
    throw new Error("Method not implemented.");
  }
}