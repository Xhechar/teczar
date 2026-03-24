import { FetchOrderDto } from "../dtos/dto";
import { OrderStatus } from "../enums/enums";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class OrderService {
  private static readonly ApiUrl = "order";

  public static async FetchByUser(): Promise<ServiceResult<FetchOrderDto>> {
    let result = await api.get<ServiceResult<FetchOrderDto>>(
      `${this.ApiUrl}/get-by-user`,
    );
    return result.data;
  }

  public static async FetchAll(): Promise<ServiceResult<FetchOrderDto>> {
    let result = await api.get<ServiceResult<FetchOrderDto>>(
      `${this.ApiUrl}/get-all`,
    );
    return result.data;
  }

  public static async UpdateOrderStatus(
    id: string,
    payload: { Status: OrderStatus },
  ): Promise<ServiceResult<FetchOrderDto>> {
    let result = await api.put<ServiceResult<FetchOrderDto>>(
      `${this.ApiUrl}/update-status/${id}`,
      payload,
    );
    return result.data;
  }
}
