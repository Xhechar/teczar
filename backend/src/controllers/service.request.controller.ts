import type { Request, Response } from "express";
import type { FetchServiceRequestDto } from "../dto/dto.js";
import { ServiceRequestService } from "../services/service.request.service.js";
import { ErrorType } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import { GetUserIdFromToken } from "../middleware/middleware.js";

export class ServiceRequestController {
  private srService: ServiceRequestService = new ServiceRequestService();

  async Create(Req: Request, Res: Response) {
    try {
      let result = await this.srService.Create(
        GetUserIdFromToken(Req),
        Req.body,
      );

      return result.Success
        ? Res.status(201).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchServiceRequestDto>(
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
      let result = await this.srService.Update(
        Req.params.id as string,
        Req.body,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchServiceRequestDto>(
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
      let result = await this.srService.Delete(Req.params.id as string);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchServiceRequestDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async FetchById(Req: Request, Res: Response) {
    try {
      let result = await this.srService.FetchById(Req.params.id as string);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchServiceRequestDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async UpdateStatus(Req: Request, Res: Response) {
    try {
      let result = await this.srService.UpdateStatus(
        Req.params.id as string,
        Req.body.Status,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchServiceRequestDto>(
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
      let result = await this.srService.FetchAll();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchServiceRequestDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async FetchByUserId(Req: Request, Res: Response) {
    try {
      let result = await this.srService.FetchByUserId(
        GetUserIdFromToken(Req)
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchServiceRequestDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }
}