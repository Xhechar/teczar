import type { Request, Response } from "express";
import { JobService } from "../services/job.service.js";
import { GetUserIdFromToken } from "../middleware/middleware.js";
import type { FetchJobDto } from "../dto/dto.js";
import { ErrorType } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";

export class JobController {
  private jobService: JobService = new JobService();

  async Create(Req: Request, Res: Response) {
    try {
      let result = await this.jobService.Create(
        GetUserIdFromToken(Req),
        Req.body,
      );

      return result.Success
        ? Res.status(201).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobDto>(
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
      let result = await this.jobService.Update(
        Req.params.id as string,
        Req.body,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobDto>(
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
      let result = await this.jobService.Delete(Req.params.id as string);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobDto>(
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
      let result = await this.jobService.FetchById(Req.params.id as string);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobDto>(
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
      let result = await this.jobService.FetchAll();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async FetchActive(Req: Request, Res: Response) {
    try {
      let result = await this.jobService.FetchActive();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }

  async SoftDelete(Req: Request, Res: Response) {
    try {
      let result = await this.jobService.SoftDelete(
        Req.params.id as string,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchJobDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }
}