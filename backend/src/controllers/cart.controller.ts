import type { Request, Response } from "express";
import type { FetchCartDto } from "../dto/dto.js";
import { CartService } from "../services/cart.service.js";
import { ErrorType } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import { GetUserIdFromToken } from "../middleware/middleware.js";

export class CartController {
  private cartService: CartService = new CartService();

  async FetchByUserId(Req: Request, Res: Response) {
    try {
      let result = await this.cartService.FetchByUserId(GetUserIdFromToken(Req));

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