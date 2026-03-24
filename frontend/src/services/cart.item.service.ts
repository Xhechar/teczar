import { CreateCartItemDto, FetchCartDto, UpdateCartItemDto } from "../dtos/dto";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class CartItemService {
  private static readonly ApiUrl = "cart-item";

  public static async Create(
    item: CreateCartItemDto,
  ): Promise<ServiceResult<FetchCartDto>> {
    let result = await api.post<ServiceResult<FetchCartDto>>(
      `${this.ApiUrl}/create`,
      item,
    );
    return result.data;
  }

  public static async Update(
    id: string,
    item: UpdateCartItemDto,
  ): Promise<ServiceResult<FetchCartDto>> {
    let result = await api.put<ServiceResult<FetchCartDto>>(
      `${this.ApiUrl}/update/${id}`,
      item,
    );
    return result.data;
  }

  public static async Delete(id: string): Promise<ServiceResult<FetchCartDto>> {
    let result = await api.delete<ServiceResult<FetchCartDto>>(
      `${this.ApiUrl}/delete/${id}`,
    );
    return result.data;
  }
}
