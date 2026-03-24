import { api } from "../middleware/middleware";
import { ServiceResult } from "../interfaces/result/service.result";
import { CreateServiceRequestDto, FetchServiceRequestDto, UpdateServiceRequestDto } from "../dtos/dto";
import { ServiceRequest } from "../interfaces/interfaces.js";

export class ServiceRequestService {
  private static readonly ApiUrl = "service-request";

  static async Create(
    payload: CreateServiceRequestDto,
  ): Promise<ServiceResult<FetchServiceRequestDto>> {
    const result = await api.post<ServiceResult<FetchServiceRequestDto>>(
      `${this.ApiUrl}/create`,
      payload,
    );
    return result.data;
  }

  static async Update(
    id: string,
    payload: UpdateServiceRequestDto,
  ): Promise<ServiceResult<FetchServiceRequestDto>> {
    const result = await api.put<ServiceResult<FetchServiceRequestDto>>(
      `${this.ApiUrl}/update/${id}`,
      payload,
    );
    return result.data;
  }

  static async Delete(id: string): Promise<ServiceResult<boolean>> {
    const result = await api.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete/${id}`,
    );
    return result.data;
  }

  static async FetchById(
    id: string,
  ): Promise<ServiceResult<FetchServiceRequestDto>> {
    const result = await api.get<ServiceResult<FetchServiceRequestDto>>(
      `${this.ApiUrl}/get/${id}`,
    );
    return result.data;
  }

  static async UpdateStatus(
    id: string,
    status: string,
  ): Promise<ServiceResult<FetchServiceRequestDto>> {
    const result = await api.patch<ServiceResult<FetchServiceRequestDto>>(
      `${this.ApiUrl}/update-status/${id}`,
      { Status: status },
    );
    return result.data;
  }

  static async FetchAll(): Promise<ServiceResult<ServiceRequest>> {
    const result = await api.get<ServiceResult<ServiceRequest>>(
      `${this.ApiUrl}/get-all`,
    );
    return result.data;
  }

  static async FetchByUserId(): Promise<
    ServiceResult<FetchServiceRequestDto>
  > {
    const result = await api.get<ServiceResult<FetchServiceRequestDto>>(
      `${this.ApiUrl}/get-by-user`,
    );
    return result.data;
  }
}
