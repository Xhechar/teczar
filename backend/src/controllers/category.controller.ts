import type { Request, Response } from "express";
import { GetUserIdFromToken } from "../middleware/middleware.js";
import { CategoryService } from "../services/category.service.js";
import type { FetchCategoryDto } from "../dto/dto.js";
import { ErrorType } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";

export class CategoryController {
  private categoryService: CategoryService = new CategoryService();

  async Create(Req: Request, Res: Response) {
    try {
      let result = await this.categoryService.Create(
        GetUserIdFromToken(Req),
        Req.body,
      );

      return result.Success
        ? Res.status(201).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchCategoryDto>(
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
      let result = await this.categoryService.Update(
        Req.params.id as string,
        Req.body,
      );

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchCategoryDto>(
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
      let result = await this.categoryService.Delete(Req.params.id as string);

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchCategoryDto>(
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
      let result = await this.categoryService.FetchAll();

      return result.Success
        ? Res.status(200).json(result)
        : Res.status(400).json(result);
    } catch (error) {
      return Res.status(500).json(
        ServiceResponse.Failure<FetchCategoryDto>(
          ErrorType.SERVER,
          error instanceof Error
            ? error.message
            : "An internal server error occured while processing your request.",
        ),
      );
    }
  }
}