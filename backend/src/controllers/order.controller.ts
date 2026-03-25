import type { Request, Response } from "express";
import type { FetchOrderDto } from "../dto/dto.js";
import { OrderService } from "../services/order.service.js";
import { ErrorType } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import { GetUserIdFromToken } from "../middleware/middleware.js";

export class OrderController {
  private orderService: OrderService = new OrderService();

  async FetchByUserId(Req: Request, Res: Response) {
    try {
      let result = await this.orderService.FetchByUserId(
        GetUserIdFromToken(Req),
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchOrderDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async FetchAll(Req: Request, Res: Response) {
    try {
      let result = await this.orderService.FetchAll();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchOrderDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async UpdateOrderStatus(Req: Request, Res: Response) {
    try {
      let result = await this.orderService.UpdateOrderStatus(
        Req.params.id as string,
        Req.body.Status
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchOrderDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }
}