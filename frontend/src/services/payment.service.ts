import { FetchPaymentDto } from "../dtos/dto";
import { Payment } from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class PaymentService {
  private static readonly ApiUrl = "payment";

  public static async InitiatePayment(): Promise<
    ServiceResult<FetchPaymentDto>
  > {
    let result = await api.post<ServiceResult<FetchPaymentDto>>(
      `${this.ApiUrl}/initiate`,
    );
    return result.data;
  }

  public static async RetryPayment(
    id: string,
  ): Promise<ServiceResult<FetchPaymentDto>> {
    let result = await api.post<ServiceResult<FetchPaymentDto>>(
      `${this.ApiUrl}/retry/${id}`,
    );
    return result.data;
  }

  public static async GetAllPayments(): Promise<
    ServiceResult<Payment>
  > {
    let result = await api.get<ServiceResult<Payment>>(
      `${this.ApiUrl}/get-all`,
    );
    return result.data;
  }
}
