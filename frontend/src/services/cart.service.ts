import { FetchCartDto } from "../dtos/dto";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class CartService {
  private static readonly ApiUrl = "cart";

  public static async FetchByUserId(
  ): Promise<ServiceResult<FetchCartDto>> {
    let result = await api.get<ServiceResult<FetchCartDto>>(
      `${this.ApiUrl}/get`,
    );
    return result.data;
  }
}
