import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateOrderDto, FetchOrderDto } from "../dto/dto.js";
import { ErrorType, OrderStatus, SocketTypes } from "../enums/enums.js";
import type { User } from "../generated/prisma/browser.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";

export class OrderService extends BaseService implements IService<FetchOrderDto, CreateOrderDto, object> {
  async FetchByUserId(id: string): Promise<ServiceResult<FetchOrderDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", id);

    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<FetchOrderDto>(
        ErrorType.NOTFOUND,
        "You are not allowed to access this service",
      );
    }

    let OrderExists = await prisma.order.findMany({
      where: {
        UserId: id
      },
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        Items: {
          include: {
            Product: {
              include: {
                Category: true,
                Reviews: {
                  where: {
                    UserId: id
                  }
                },
              }
            }
          }
        },
        User: true
      }
    });

    if(!OrderExists) {
      return ServiceResponse.Failure<FetchOrderDto>(ErrorType.NOTFOUND, "Oder(s) not found at the moment.");
    }

    return ServiceResponse.Success<FetchOrderDto>(
      "Oder(s) fetched successfully.",
      undefined,
      OrderExists.map((o) => ({
        OrderId: o.OrderId,
        Status: o.Status,
        TotalAmount: o.TotalAmount.toNumber(),
        Items: o.Items.map((i) => ({
          OrderItemId: i.OrderItemId,
          ProductId: i.ProductId,
          Name: i.Product.Name,
          Quantity: i.Product.Quantity,
          PriceAtPurchase: i.PriceAtPurchase.toNumber(),
          Product: {
            Name: i.Product.Name,
            Category: {
              CategoryId: i.Product.Category.CategoryId,
              Name: i.Product.Category.Name,
            },
            Reviews: i.Product.Reviews?.map((r) => ({
              ReviewId: r.ReviewId,
              Rating: r.Rating,
              Message: r.Message,
            })),
          },
        })),
        CreatedAt: o.CreatedAt,
        User: {
          FirstName: o.User.FirstName,
          SecondName: o.User.SecondName,
          Phone: o.User.Phone,
          Email: o.User.Email,
          County: o.User.County,
        },
      })),
    );
  }
  async FetchAll(): Promise<ServiceResult<FetchOrderDto>> {
    let OrderExists = await prisma.order.findMany({
      orderBy: {
        CreatedAt: "desc",
      },
      include: {
        Items: {
          include: {
            Product: {
              include: {
                Category: true,
              }
            },
          },
        },
        User: true
      },
    });

    if (!OrderExists) {
      return ServiceResponse.Failure<FetchOrderDto>(
        ErrorType.NOTFOUND,
        "Oder(s) not found at the moment.",
      );
    }

    return ServiceResponse.Success<FetchOrderDto>(
      "Oder(s) fetched successfully.",
      undefined,
      OrderExists.map((o) => ({
        OrderId: o.OrderId,
        Status: o.Status,
        TotalAmount: o.TotalAmount.toNumber(),
        Items: o.Items.map((i) => ({
          OrderItemId: i.OrderItemId,
          ProductId: i.ProductId,
          Name: i.Product.Name,
          Quantity: i.Product.Quantity,
          PriceAtPurchase: i.PriceAtPurchase.toNumber(),
          Product: {
            Name: i.Product.Name,
            Category: {
              CategoryId: i.Product.Category.CategoryId,
              Name: i.Product.Category.Name,
            },
          },
        })),
        CreatedAt: o.CreatedAt,
        User: {
          FirstName: o.User.FirstName,
          SecondName: o.User.SecondName,
          Phone: o.User.Phone,
          Email: o.User.Email,
          County: o.User.County,
        },
      })),
    );
  }
  async UpdateOrderStatus(id: string, status: OrderStatus): Promise<ServiceResult<FetchOrderDto>> {
    let orderExists = await prisma.order.findUnique({
      where: {
        OrderId: id
      }
    });

    if(!orderExists) {
      return ServiceResponse.Failure<FetchOrderDto>(
        ErrorType.NOTFOUND,
        "Oder(s) not found at the moment.",
      );
    }

    let updateStatus = await prisma.order.update({
      where: {
        OrderId: id
      },
      data: {
        Status: status
      }
    });

    if(!updateStatus) {
      return ServiceResponse.Failure<FetchOrderDto>(
        ErrorType.SERVER,
        "Unable to update order at the moment.",
      );
    }

    io.emit(SocketTypes.oru);

    return ServiceResponse.Success<FetchOrderDto>(
      "Order updated successfully.",
    );
  }
  async Create(UserId: string, data: CreateOrderDto): Promise<ServiceResult<FetchOrderDto>> {
    throw new Error("Method not implemented.");
  }
  async Update(id: string, data: object, UserId?: string): Promise<ServiceResult<FetchOrderDto>> {
    throw new Error("Method not implemented.");
  }
  async Delete(id: string, UserId?: string): Promise<ServiceResult<FetchOrderDto>> {
    throw new Error("Method not implemented.");
  }
  
}