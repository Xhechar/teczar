import {
  CreateProductDto,
  FetchProductDto,
  UpdateProductDto,
} from "../dtos/dto";
import { Product } from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class ProductService {
  private static readonly ApiUrl = "product";

  public static async Create(
    product: CreateProductDto,
  ): Promise<ServiceResult<FetchProductDto>> {
    let result = await api.post<ServiceResult<FetchProductDto>>(
      `${this.ApiUrl}/create`,
      product,
    );
    return result.data;
  }

  public static async Update(
    id: string,
    product: UpdateProductDto,
  ): Promise<ServiceResult<FetchProductDto>> {
    let result = await api.put<ServiceResult<FetchProductDto>>(
      `${this.ApiUrl}/update/${id}`,
      product,
    );
    return result.data;
  }

  public static async Delete(id: string): Promise<ServiceResult<boolean>> {
    let result = await api.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete/${id}`,
    );
    return result.data;
  }

  public static async FetchById(
    id: string,
  ): Promise<ServiceResult<FetchProductDto>> {
    let result = await api.get<ServiceResult<FetchProductDto>>(
      `${this.ApiUrl}/get/${id}`,
    );
    return result.data;
  }

  public static async FetchAll(): Promise<ServiceResult<Product>> {
    let result = await api.get<ServiceResult<Product>>(
      `${this.ApiUrl}/get-all`,
    );
    return result.data;
  }
}
