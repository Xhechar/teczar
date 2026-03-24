import type { Request, Response } from "express";
import type { CreateHeroSlideDto } from "../dto/dto.js";
import type { HeroSlide } from "../interfaces/interfaces.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { HeroSliderService } from "../services/hero.slider.service.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import { ErrorType } from "../enums/enums.js";
import { GetUserIdFromToken } from "../middleware/middleware.js";

export class HeroSliderController {
  private hsService: HeroSliderService = new HeroSliderService();

  async Create(Req: Request, Res: Response) {
    try {
      let result = await this.hsService.Create(
        GetUserIdFromToken(Req),
        Req.body,
      );

      return result.Success
        ? Res.status(201).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "Internal server error occured, try again later.",
        ),
      );
    }
  }
  async Update(Req: Request, Res: Response) {
    try {
      let result = await this.hsService.Update(
        Req.params.id as string,
        Req.body,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "Internal server error occured, try again later.",
        ),
      );
    }
  }
  async Delete(Req: Request, Res: Response) {
    try {
      let result = await this.hsService.Delete(
        Req.params.id as string,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "Internal server error occured, try again later.",
        ),
      );
    }
  }
  async ToggleActive(Req: Request, Res: Response) {
    try {
      let result = await this.hsService.ToggleActive(
        Req.params.id as string,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "Internal server error occured, try again later.",
        ),
      );
    }
  }
  async FetchAll(Req: Request, Res: Response) {
    try {
      let result = await this.hsService.FetchAll();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "Internal server error occured, try again later.",
        ),
      );
    }
  }
  async FetchActive(Req: Request, Res: Response) {
    try {
      let result = await this.hsService.FetchActive();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "Internal server error occured, try again later.",
        ),
      );
    }
  }
}
