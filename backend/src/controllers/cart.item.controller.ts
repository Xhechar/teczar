import type { Request, Response } from "express";
import { CartItemService } from "../services/cart.item.service.js";
import { GetUserIdFromToken } from "../middleware/middleware.js";
import type { FetchCartDto } from "../dto/dto.js";
import { ErrorType } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";

export class CartItemController {
  private cartItemService: CartItemService = new CartItemService();

  async Create(Req: Request, Res: Response) {
    try {
      let result = await this.cartItemService.Create(
        GetUserIdFromToken(Req),
        Req.body,
      );

      return result.Success
        ? Res.status(201).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchCartDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async Update(Req: Request, Res: Response) {
    try {
      let result = await this.cartItemService.Update(
        Req.params.id as string,
        Req.body,
        GetUserIdFromToken(Req),
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchCartDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async Delete(Req: Request, Res: Response) {
    try {
      let result = await this.cartItemService.Delete(
        Req.params.id as string
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchCartDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }
}