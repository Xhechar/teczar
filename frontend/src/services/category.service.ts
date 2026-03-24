import { CreateCategoryDto, FetchCategoryDto, UpdateCategoryDto } from "../dtos/dto";
import { Category } from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class CategoryService {
  private static readonly ApiUrl = "category";

  public static async Create(
    category: CreateCategoryDto
  ): Promise<ServiceResult<FetchCategoryDto>> {
    let result = await api.post<ServiceResult<FetchCategoryDto>>(
      `${this.ApiUrl}/create`,
      category
    );
    return result.data;
  }

  public static async Update(
    id: string,
    category: UpdateCategoryDto
  ): Promise<ServiceResult<FetchCategoryDto>> {
    let result = await api.put<ServiceResult<FetchCategoryDto>>(
      `${this.ApiUrl}/update/${id}`,
      category
    );
    return result.data;
  }

  public static async Delete(
    id: string
  ): Promise<ServiceResult<boolean>> {
    let result = await api.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete/${id}`
    );
    return result.data;
  }

  public static async FetchAll(): Promise<
    ServiceResult<Category>
  > {
    let result = await api.get<ServiceResult<Category>>(
      `${this.ApiUrl}/get-all`
    );
    return result.data;
  }
}