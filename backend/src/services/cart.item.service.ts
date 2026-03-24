import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateCartItemDto, FetchCartDto, UpdateCartItemDto } from "../dto/dto.js";
import { ErrorType, SocketTypes } from "../enums/enums.js";
import { EmitToSigleUser } from "../events/socket.events.js";
import type { CartItem, User } from "../generated/prisma/client.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";

export class CartItemService extends BaseService implements IService<FetchCartDto, CreateCartItemDto, UpdateCartItemDto> {
  async Create(UserId: string, data: CreateCartItemDto): Promise<ServiceResult<FetchCartDto>> {
    let userExists = await this.Exists<User>(prisma.user, "UserId", UserId);

    if(userExists.Success === false && !userExists.Data) {
      return ServiceResponse.Failure<FetchCartDto>(ErrorType.NOTFOUND, "You are not authorized to access this serivice.");
    }

    let productExists = await prisma.product.findUnique({
      where: {
        ProductId: data.ProductId,
      },
    });

    if (!productExists) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.NOTFOUND,
        "Product specified not found.",
      );
    }

    if (productExists.Quantity === 0) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.VALIDATION,
        "Product is out of stock.",
      );
    }

    if (productExists.Quantity - data.Quantity < 0) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.VALIDATION,
        "Kindly adjust quantity since products are limited",
      );
    }

    let cartExists = await prisma.cart.findFirst({
      where: {
        UserId
      }
    });

    if(!cartExists) {
      let createCart = await prisma.cart.create({
        data: {
          UserId
        }
      });

      if(!createCart) {
        return ServiceResponse.Failure<FetchCartDto>(
          ErrorType.SERVER,
          "Unable to create cart at the moment.",
        );
      }

      EmitToSigleUser(io, UserId, SocketTypes.cac);

      let createCartItem = await prisma.cartItem.create({
        data: {
          CartId: createCart.CartId,
          ...data
        }
      });

      if(!createCartItem) {
        return ServiceResponse.Failure<FetchCartDto>(
          ErrorType.SERVER,
          "Unable to add item to cart.",
        );
      }

      EmitToSigleUser(io, UserId, SocketTypes.cau);

      return ServiceResponse.Success<FetchCartDto>("Item added to cart.");
    }

    let cartItemExist = await prisma.cartItem.findFirst({
      where: {
        ProductId: data.ProductId,
        CartId: cartExists.CartId
      }
    });

    if(cartItemExist) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.CLIENT,
        "Product already exists in cart.",
      );
    }

    let createCartItem = await prisma.cartItem.create({
      data: {
        CartId: cartExists.CartId,
        ...data,
      },
    });

    if (!createCartItem) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.SERVER,
        "Unable to add item to cart.",
      );
    }

    EmitToSigleUser(io, UserId, SocketTypes.cau);

    return ServiceResponse.Success<FetchCartDto>("Item added to cart.");
  }
  async Update(id: string, data: UpdateCartItemDto, UserId: string): Promise<ServiceResult<FetchCartDto>> {
    let userExists = await this.Exists<User>(prisma.user, "UserId", UserId);

    if(userExists.Success === false && !userExists.Data) {
      return ServiceResponse.Failure<FetchCartDto>(ErrorType.NOTFOUND, "You are not authorized to access this serivice.");
    }

    let itemExist = await this.Exists<CartItem>(prisma.cartItem, "CartItemId", id, {Product: true});

    if(!itemExist.Success && !itemExist.Data) {
      return ServiceResponse.Failure<FetchCartDto>(ErrorType.NOTFOUND, "Cart Item not found.");
    }

    let productExists = await prisma.product.findUnique({
      where: {
        ProductId: itemExist.Data?.ProductId as string,
      },
    });

    if (!productExists) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.NOTFOUND,
        "Product specified not found.",
      );
    }

    if (productExists.Quantity === 0) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.VALIDATION,
        "Product is out of stock.",
      );
    }

    if ((productExists.Quantity - data.Quantity) < 0) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.VALIDATION,
        "Kindly adjust quantity since products are limited",
      );
    }

    let updateCartItem = await prisma.cartItem.update({
      where: {
        CartItemId: id
      },
      data
    });

    if(!updateCartItem) {
      return ServiceResponse.Failure<FetchCartDto>(ErrorType.SERVER, "Unable to update cart item.")
    }

    EmitToSigleUser(io, UserId, SocketTypes.cau);

    return ServiceResponse.Success<FetchCartDto>("Item updated successfully.");
  }
  async Delete(id: string): Promise<ServiceResult<FetchCartDto>> {
    
    let itemExist = await prisma.cartItem.delete({
      where: {
        CartItemId: id
      },
      include: {
        Cart: true
      }
    });

    if(!itemExist) {
      return ServiceResponse.Failure<FetchCartDto>(ErrorType.NOTFOUND, "Item specified not found.");
    }

    let deleteItem = await prisma.cartItem.delete({
      where: {
        CartItemId: itemExist.CartItemId
      }
    });

    if(!deleteItem) {
      return ServiceResponse.Failure<FetchCartDto>(
        ErrorType.SERVER,
        "Unable to remove item.",
      );
    }

    EmitToSigleUser(io, itemExist.Cart.UserId, SocketTypes.cau);

    return ServiceResponse.Success<FetchCartDto>(
      "Item removed successfully.",
    );
  }  
}