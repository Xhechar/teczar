import type { Request, Response } from "express";
import { GetUserIdFromToken } from "../middleware/middleware.js";
import { JobApplicationService } from "../services/job.application.service.js";
import type { FetchJobApplicationDto } from "../dto/dto.js";
import { ErrorType } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";

export class JobApplicationController {
  private jaService: JobApplicationService = new JobApplicationService();

  async Create(Req: Request, Res: Response) {
    try {
      let result = await this.jaService.Create(
        GetUserIdFromToken(Req),
        Req.body,
      );

      return result.Success
        ? Res.status(201).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobApplicationDto>(
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
      let result = await this.jaService.Delete(Req.params.id as string);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobApplicationDto>(
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
      let result = await this.jaService.FetchById(Req.params.id as string);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobApplicationDto>(
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
      let result = await this.jaService.FetchByUserId(GetUserIdFromToken(Req));

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobApplicationDto>(
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
      let result = await this.jaService.FetchAll();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobApplicationDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async UpdateApplicationStatus(Req: Request, Res: Response) {
    try {
      let result = await this.jaService.UpdateApplicationStatus(
        Req.params.id as string,
        Req.body.Status,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobApplicationDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }
}