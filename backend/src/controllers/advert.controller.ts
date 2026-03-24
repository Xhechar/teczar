import type { Request, Response } from "express";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import { ErrorType } from "../enums/enums.js";
import { AdvertService } from "../services/advert.service.js";
import { GetUserIdFromToken } from "../middleware/middleware.js";
import type { FetchAdvertDto } from "../dto/dto.js";

export class AdvertController {
  private advertService: AdvertService = new AdvertService();

  async Create(Req: Request, Res: Response) {
    try {
      let result = await this.advertService.Create(
        GetUserIdFromToken(Req),
        Req.body,
      );

      return result.Success
        ? Res.status(201).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchAdvertDto>(
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
      let result = await this.advertService.Update(
        Req.params.id as string,
        Req.body,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchAdvertDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }
  async ToggleAdvert(Req: Request, Res: Response) {
    try {
      let result = await this.advertService.ToggleAdvert(
        Req.params.id as string,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchAdvertDto>(
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
      let result = await this.advertService.Delete(Req.params.id as string);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchAdvertDto>(
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
      let result = await this.advertService.FetchById(Req.params.id as string);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchAdvertDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }
  async FetchActiveAdverts(Req: Request, Res: Response) {
    try {
      let result = await this.advertService.FetchActiveAdvert();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchAdvertDto>(
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
      let result = await this.advertService.FetchAll();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchAdvertDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }
}