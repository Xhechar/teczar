import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateCategoryDto, FetchCategoryDto, UpdateCategoryDto } from "../dto/dto.js";
import { ErrorType, SocketTypes } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateCategoryValidator, UpdateCategoryValidator } from "../validators/validators.js";

export class CategoryService extends BaseService implements IService<FetchCategoryDto, CreateCategoryDto, UpdateCategoryDto> {
  async Create(UserId: string, data: CreateCategoryDto): Promise<ServiceResult<FetchCategoryDto>> {
    
    let {error} = CreateCategoryValidator.validate(data);
    
    if(error) {
      return ServiceResponse.Failure<FetchCategoryDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let createCategory = await prisma.category.create({
      data
    });

    if(!createCategory) {
      return ServiceResponse.Failure<FetchCategoryDto>(ErrorType.SERVER, "Unable to create category at the moment.");
    }

    io.emit(SocketTypes.cgc);

    return ServiceResponse.Success<FetchCategoryDto>("Category created successfully.");
  }
  async Update(id: string, data: UpdateCategoryDto): Promise<ServiceResult<FetchCategoryDto>> {
    
    let categoryExists = await this.Exists(prisma.category, "CategoryId", id);

    if(!categoryExists.Success && !categoryExists.Data) {
      return ServiceResponse.Failure<FetchCategoryDto>(
        ErrorType.NOTFOUND,
        "Category specified not found.",
      );
    }

    let { error } = UpdateCategoryValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchCategoryDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let updateCategory = await prisma.category.update({
      data,
      where: {
        CategoryId: id
      }
    });

    if (!updateCategory) {
      return ServiceResponse.Failure<FetchCategoryDto>(
        ErrorType.SERVER,
        "Unable to update category at the moment.",
      );
    }

    io.emit(SocketTypes.cgu);

    return ServiceResponse.Success<FetchCategoryDto>(
      "Category updated successfully.",
    );
  }
  async Delete(id: string): Promise<ServiceResult<FetchCategoryDto>> {
    let categoryExists = await this.Exists(prisma.category, "CategoryId", id);

    if (!categoryExists.Success && !categoryExists.Data) {
      return ServiceResponse.Failure<FetchCategoryDto>(
        ErrorType.NOTFOUND,
        "Category specified not found.",
      );
    }

    let deleteCategory = await prisma.category.delete({
      where: {
        CategoryId: id,
      },
    });

    if (!deleteCategory) {
      return ServiceResponse.Failure<FetchCategoryDto>(
        ErrorType.SERVER,
        "Unable to delete category at the moment.",
      );
    }

    io.emit(SocketTypes.cgd);

    return ServiceResponse.Success<FetchCategoryDto>(
      "Category deleted successfully.",
    );
  }
  async FetchAll(): Promise<ServiceResult<FetchCategoryDto>> {
    
    let fetchCategories = await prisma.category.findMany();

    if(!fetchCategories) {
      return ServiceResponse.Failure<FetchCategoryDto>(ErrorType.NOTFOUND, "Categories not found.");
    }

    return ServiceResponse.Success<FetchCategoryDto>("Categories fetched successfully.", undefined, fetchCategories.map((c) => ({
      CategoryId: c.CategoryId,
      Name: c.Name,
      ImageUrl: c.ImageUrl as string,
      CreatedAt: c.CreatedAt
    })));
  }  
}