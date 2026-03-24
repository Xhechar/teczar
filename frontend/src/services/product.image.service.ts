import {
  CreateProductImageDto,
  FetchProductImageDto,
  UpdateProductImageDto,
} from "../dtos/dto";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class ProductImageService {
  private static readonly ApiUrl = "product-image";

  public static async Create(
    payload: CreateProductImageDto,
  ): Promise<ServiceResult<FetchProductImageDto>> {
    let result = await api.post<ServiceResult<FetchProductImageDto>>(
      `${this.ApiUrl}/create`,
      payload,
    );
    return result.data;
  }

  public static async Update(
    id: string,
    payload: UpdateProductImageDto,
  ): Promise<ServiceResult<FetchProductImageDto>> {
    let result = await api.put<ServiceResult<FetchProductImageDto>>(
      `${this.ApiUrl}/update/${id}`,
      payload,
    );
    return result.data;
  }

  public static async Delete(id: string): Promise<ServiceResult<boolean>> {
    let result = await api.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete/${id}`,
    );
    return result.data;
  }
}
