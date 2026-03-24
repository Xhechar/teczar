import type { Request, Response } from "express";
import { PaymentService } from "../services/payment.service.js";
import type { FetchPaymentDto } from "../dto/dto.js";
import { ErrorType } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import { GetUserIdFromToken } from "../middleware/middleware.js";

export class PaymentController {
  private paymentService: PaymentService = new PaymentService();

  async InitiatePayment(Req: Request, Res: Response) {
    try {
      let result = await this.paymentService.InitiatePayment(
        GetUserIdFromToken(Req),
      );

      return result.Success
        ? Res.status(201).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchPaymentDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async RetryPayment(Req: Request, Res: Response) {
    try {
      let result = await this.paymentService.RetryPayment(
        GetUserIdFromToken(Req),
        Req.params.id as string,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchPaymentDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async StkCallBackReceiver(Req: Request, Res: Response) {
    try {
      await this.paymentService.StkCallBackReceiver(Req.body);

      return Res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback received successfully",
      });
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchPaymentDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async GetAllPayments(Req: Request, Res: Response) {
    try {
      let result = await this.paymentService.GetAllPayments();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchPaymentDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }
}